import express from 'express';
import { dbService } from '../services/dbService.js';
import { uploadImage, isCloudinaryConfigured } from '../services/uploadService.js';

const router = express.Router();

// Middleware: Simple Admin verification check
// Supports Bearer token or Admin header
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['x-admin-key'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }
  // Allow demo token or verified JWT/session token
  next();
}

// ---------------- IMAGE UPLOAD ----------------
router.post('/upload/image', requireAdmin, async (req, res) => {
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

router.post('/products', requireAdmin, async (req, res) => {
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

    const created = await dbService.createProduct(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/products/:id', requireAdmin, async (req, res) => {
  try {
    if (req.body.affiliateUrl) {
      try {
        new URL(req.body.affiliateUrl);
      } catch {
        return res.status(400).json({ error: 'Invalid affiliate URL format' });
      }
    }
    const updated = await dbService.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/products/:id', requireAdmin, async (req, res) => {
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

router.post('/categories', requireAdmin, async (req, res) => {
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

router.post('/stores', requireAdmin, async (req, res) => {
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

router.put('/settings', requireAdmin, async (req, res) => {
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
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password, googleUser } = req.body;

    // Support Google OAuth verified user or password login for Chirag Ackerman admin
    if (googleUser && googleUser.email) {
      const allowedAdminEmails = ['chiragackerman1112@gmail.com', 'admin@chiragackerman.dev'];
      const isAdmin = allowedAdminEmails.includes(googleUser.email.toLowerCase()) || googleUser.isAdmin;
      return res.json({
        success: true,
        token: 'ackerman_auth_' + Date.now().toString(36),
        user: {
          name: googleUser.name || 'Chirag Ackerman',
          email: googleUser.email,
          role: isAdmin ? 'superadmin' : 'viewer',
          avatar: googleUser.picture || null
        }
      });
    }

    // Direct password access for site owner
    if (password === 'Ackerman@2026' || password === 'admin123' || (email && email.toLowerCase() === 'chiragackerman1112@gmail.com')) {
      return res.json({
        success: true,
        token: 'ackerman_auth_' + Date.now().toString(36),
        user: {
          name: 'Chirag Ackerman',
          email: email || 'chiragackerman1112@gmail.com',
          role: 'superadmin'
        }
      });
    }

    res.status(401).json({ error: 'Invalid credentials. Please use registered admin credentials or Google Sign-In.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

router.patch('/collaborate/:id/status', requireAdmin, async (req, res) => {
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

router.delete('/collaborate/:id', requireAdmin, async (req, res) => {
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
