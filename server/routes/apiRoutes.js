import express from 'express';
import mongoose from 'mongoose';
import { dbService } from '../services/dbService.js';
import { uploadImage, isCloudinaryConfigured } from '../services/uploadService.js';
import {
  createAdminSession,
  destroyAdminSession,
  findAdminSession,
  getAuthConfig,
  getSessionCookieOptions,
  publicAdmin,
  verifyAdminCredentials
} from '../services/authService.js';

const router = express.Router();

const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Authentication service is unavailable' });
  }
  next();
}

async function requireAdmin(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Authentication service is unavailable' });
    }
    const session = await findAdminSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.admin = session.admin;
    next();
  } catch (err) {
    console.error('Admin session validation failed:', err.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

function requireSameOrigin(req, res, next) {
  const origin = req.get('origin');
  if (!origin) return next();

  try {
    const originUrl = new URL(origin);
    const expectedHost = req.get('host');
    if (originUrl.host !== expectedHost || !['http:', 'https:'].includes(originUrl.protocol)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  } catch {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    loginAttempts.set(ip, { count: 0, resetAt: now + LOGIN_WINDOW_MS });
    return false;
  }
  return entry.count >= MAX_LOGIN_ATTEMPTS;
}

function recordFailedLogin(ip) {
  const entry = loginAttempts.get(ip) || { count: 0, resetAt: Date.now() + LOGIN_WINDOW_MS };
  entry.count += 1;
  loginAttempts.set(ip, entry);
}

// ---------------- IMAGE UPLOAD ----------------
router.post('/upload/image', requireAdmin, requireSameOrigin, async (req, res) => {
  try {
    const { dataUrl, fileName, mimeType } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: 'Image data is required' });
    }
    const result = await uploadImage({ dataUrl, fileName, mimeType });
    res.json({
      success: true,
      url: result.url,
      imageUrl: result.url,
      provider: result.provider,
      fileName: result.fileName
    });
  } catch (err) {
    console.error('Image upload endpoint error:', err);
    res.status(500).json({ error: err.message || 'Image upload failed' });
  }
});

router.get('/upload/status', requireAdmin, (req, res) => {
  res.json({
    cloudinaryConfigured: isCloudinaryConfigured(),
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    maxSizeMb: 10
  });
});

// ---------------- PRODUCTS ----------------
router.get('/products', async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    const filters = {
      category,
      featured: featured === 'true',
      search,
      published: true
    };
    const products = await dbService.getProducts(filters);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/products/all', requireAdmin, async (req, res) => {
  try {
    const products = await dbService.getProducts({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await dbService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/products', requireAdmin, requireSameOrigin, async (req, res) => {
  try {
    const { name, brand, affiliateUrl, category } = req.body;
    if (!name || !brand || !affiliateUrl || !category) {
      return res.status(400).json({ error: 'Name, brand, affiliate URL and category are required' });
    }

    // Validate URL format
    try {
      new URL(affiliateUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid affiliate URL format' });
    }

    const created = await dbService.createProduct({
      ...req.body,
      couponCode: typeof req.body.couponCode === 'string' ? req.body.couponCode.trim() : ''
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/products/:id', requireAdmin, requireSameOrigin, async (req, res) => {
  try {
    if (req.body.affiliateUrl) {
      try {
        new URL(req.body.affiliateUrl);
      } catch {
        return res.status(400).json({ error: 'Invalid affiliate URL format' });
      }
    }
    const updated = await dbService.updateProduct(req.params.id, {
      ...req.body,
      ...(Object.prototype.hasOwnProperty.call(req.body, 'couponCode')
        ? { couponCode: typeof req.body.couponCode === 'string' ? req.body.couponCode.trim() : '' }
        : {})
    });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/products/:id', requireAdmin, requireSameOrigin, async (req, res) => {
  try {
    const deleted = await dbService.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- CATEGORIES ----------------
router.get('/categories', async (req, res) => {
  try {
    const categories = await dbService.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/categories', requireAdmin, requireSameOrigin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });
    const created = await dbService.createCategory(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- STORES ----------------
router.get('/stores', async (req, res) => {
  try {
    const stores = await dbService.getStores();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/stores', requireAdmin, requireSameOrigin, async (req, res) => {
  try {
    const { name, url } = req.body;
    if (!name || !url) return res.status(400).json({ error: 'Name and URL are required' });
    const created = await dbService.createStore(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- SITE SETTINGS ----------------
router.get('/settings', async (req, res) => {
  try {
    const config = await dbService.getSiteConfig();
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/settings', requireAdmin, requireSameOrigin, async (req, res) => {
  try {
    const updated = await dbService.updateSiteConfig(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- ANALYTICS & CLICK TRACKING ----------------
router.post('/track-click', async (req, res) => {
  try {
    const { productId, productName, store, affiliateUrl, referrer, deviceCategory } = req.body;
    if (!productId || !affiliateUrl) {
      return res.status(400).json({ error: 'productId and affiliateUrl are required' });
    }

    const recorded = await dbService.recordClick({
      productId,
      productName,
      store,
      affiliateUrl,
      referrer: referrer || req.headers.referer || 'direct',
      deviceCategory: deviceCategory || 'desktop'
    });

    res.json({ success: true, recordId: recorded._id || recorded.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics', requireAdmin, async (req, res) => {
  try {
    const summary = await dbService.getAnalyticsSummary();
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- AUTHENTICATION ----------------
router.post('/auth/login', requireDatabase, requireSameOrigin, async (req, res) => {
  try {
    const config = getAuthConfig();
    if (!config.valid) return res.status(503).json({ error: 'Authentication service is unavailable' });
    if (isRateLimited(req.ip)) return res.status(429).json({ error: 'Too many login attempts. Try again later.' });

    const { email, password } = req.body || {};
    const admin = await verifyAdminCredentials(email, password);
    if (!admin) {
      recordFailedLogin(req.ip);
      return res.status(401).json({ error: 'Invalid credentials or unauthorized account.' });
    }

    loginAttempts.delete(req.ip);
    const { cookie, expiresAt } = await createAdminSession(admin);
    admin.lastLogin = new Date();
    await admin.save();
    res.setHeader('Set-Cookie', cookie);
    res.json({ success: true, user: publicAdmin(admin), expiresAt });
  } catch (err) {
    console.error('Admin login failed:', err.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

router.get('/auth/session', requireDatabase, async (req, res) => {
  try {
    const session = await findAdminSession(req);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });
    res.json({ authenticated: true, user: publicAdmin(session.admin), expiresAt: session.session.expiresAt });
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

router.post('/auth/logout', requireDatabase, requireSameOrigin, async (req, res) => {
  await destroyAdminSession(req);
  res.setHeader('Set-Cookie', getSessionCookieOptions());
  res.json({ success: true });
});

// ---------------- CONTACT & COLLABORATION ----------------
router.post('/collaborate', async (req, res) => {
  try {
    const { name, brand, email, website, collaborationType, message } = req.body;

    if (!name || !brand || !email || !message) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const contactName = String(name).trim();
    const companyName = String(brand).trim();
    const emailAddress = String(email).trim().toLowerCase();
    const websiteValue = website ? String(website).trim() : '';
    const messageText = String(message).trim();
    const typeValue = collaborationType ? String(collaborationType).trim() : 'Product Feature & Review';

    if (!contactName || !companyName || !emailAddress || !messageText) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (!emailAddress.includes('@') || !emailAddress.includes('.')) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    if (websiteValue && !/^https?:\/\//i.test(websiteValue)) {
      return res.status(400).json({ error: 'Please provide a valid website URL' });
    }

    const inquiry = await dbService.createCollaborationInquiry({
      name: contactName,
      brand: companyName,
      email: emailAddress,
      website: websiteValue,
      collaborationType: typeValue,
      message: messageText
    });

    console.log(`[New Brand Inquiry] From: ${contactName} (${companyName} - ${emailAddress}), Type: ${typeValue}`);
    res.status(201).json({
      success: true,
      inquiryId: inquiry.inquiryId || inquiry._id,
      message: 'Collaboration proposal received. Chirag Ackerman will review and respond within 24-48 hours.'
    });
  } catch (err) {
    console.error('Collaboration submission error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to submit collaboration inquiry' });
  }
});

router.get('/collaborate', requireAdmin, async (req, res) => {
  try {
    const inquiries = await dbService.getCollaborationInquiries();
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch inquiries' });
  }
});

router.get('/collaborate/:id', requireAdmin, async (req, res) => {
  try {
    const inquiry = await dbService.getCollaborationInquiryById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch inquiry' });
  }
});

router.patch('/collaborate/:id/status', requireAdmin, requireSameOrigin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = await dbService.updateCollaborationInquiryStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update inquiry status' });
  }
});

router.delete('/collaborate/:id', requireAdmin, requireSameOrigin, async (req, res) => {
  try {
    const deleted = await dbService.deleteCollaborationInquiry(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete inquiry' });
  }
});

router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide your name, email, and message' });
    }
    console.log(`[Contact Form Submission] From: ${name} (${email})`);
    res.json({
      success: true,
      message: 'Message sent successfully! Chirag will get back to you soon.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
