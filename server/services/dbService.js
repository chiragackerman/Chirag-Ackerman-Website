import mongoose from 'mongoose';

// CRITICAL: fail fast, don't hang when MongoDB is unreachable
mongoose.set('bufferCommands', false);

import { initialProducts } from '../../src/data/initialProducts.js';
import { initialCategories } from '../../src/data/initialCategories.js';
import { initialStores } from '../../src/data/initialStores.js';
import { defaultSiteConfig } from '../../src/data/defaultSiteConfig.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Store } from '../models/Store.js';
import { Click } from '../models/Click.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { CollaborationInquiry } from '../models/CollaborationInquiry.js';
import { ensureAdminAccount, getAuthConfig } from './authService.js';

let isMongoConnected = false;
let databaseInitialization;
const isVercelDeployment = process.env.VERCEL === '1' && process.env.VERCEL_ENV !== 'development';

async function upsertIfMissing(Model, filter, update) {
  try {
    return await Model.updateOne(filter, update, { upsert: true });
  } catch (error) {
    if (error.code !== 11000 || !(await Model.exists(filter))) throw error;
    return await Model.updateOne(filter, update);
  }
}

// Fallback in-memory data store when MONGODB_URI is not set or unreachable
const memoryStore = {
  products: [...initialProducts],
  categories: [...initialCategories],
  stores: [...initialStores],
  siteConfig: { ...defaultSiteConfig },
  clicks: [
    {
      id: "clk-1",
      productId: "eweadn-x23-pro",
      productName: "EWEADN X23 Pro Wireless Mouse",
      store: "Amazon India",
      affiliateUrl: "https://www.amazon.in/s?k=EWEADN+X23+Pro",
      referrer: "chiragackerman.dev/shop",
      deviceCategory: "desktop",
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: "clk-2",
      productId: "ant-esports-mk1300-v2",
      productName: "Ant Esports MK1300 V2 Mechanical Keyboard",
      store: "Amazon India",
      affiliateUrl: "https://www.amazon.in/s?k=Ant+Esports+MK1300+V2",
      referrer: "chiragackerman.dev/setup",
      deviceCategory: "desktop",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: "clk-3",
      productId: "noctwls-desk-mat",
      productName: "Noctwls Minimalist Desk Mat",
      store: "Brand Store",
      affiliateUrl: "https://www.amazon.in/s?k=Noctwls+desk+mat",
      referrer: "chiragackerman.dev",
      deviceCategory: "mobile",
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString()
    }
  ]
};

function initializeMemoryProductOrders(flagField, orderField) {
  const maxExistingOrder = memoryStore.products.reduce((maxOrder, product) => Math.max(maxOrder, product[orderField] || 0), 0);
  const missingOrders = memoryStore.products
    .filter((product) => product[flagField] === true && product[orderField] == null)
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  missingOrders.forEach((product, index) => {
    product[orderField] = maxExistingOrder + index + 1;
  });
}

initializeMemoryProductOrders('featured', 'featuredOrder');
initializeMemoryProductOrders('showInMySetup', 'setupOrder');

let lastConnectionAttempt = 0;
const CONNECTION_COOLDOWN_MS = 20000;

export function initDatabase() {
  if (mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return Promise.resolve();
  }
  if (mongoose.connection.readyState === 2) {
    return databaseInitialization || Promise.resolve();
  }
  const now = Date.now();
  if (now - lastConnectionAttempt < CONNECTION_COOLDOWN_MS && !isVercelDeployment) {
    return Promise.resolve();
  }
  lastConnectionAttempt = now;
  if (!databaseInitialization) {
    databaseInitialization = initializeDatabase().finally(() => {
      databaseInitialization = null;
    });
  }
  return databaseInitialization;
}

async function initializeDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      console.log('Attempting MongoDB connection...');
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000
      });
      isMongoConnected = true;
      console.log('Connected to MongoDB successfully.');
      await runSafeDatabaseInitialization();
      return;
    } catch (err) {
      isMongoConnected = false;
      databaseInitialization = null;
      if (isVercelDeployment || process.env.NODE_ENV === 'production') {
        console.error('MongoDB initialization failed in Vercel/production runtime:', err.message);
        throw err;
      }
      console.warn('MongoDB connection failed. Operating in local memory fallback mode:', err.message);
    }
  } else {
    if (isVercelDeployment || process.env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI must be configured for the Vercel deployment.');
    }
    console.log('No MONGODB_URI provided in environment. Operating in memory repository mode.');
  }

  const authConfig = getAuthConfig();
  if (!authConfig.valid) {
    const details = authConfig.missing?.length
      ? `Missing server-side environment variables: ${authConfig.missing.join(', ')}`
      : authConfig.error;
    console.warn(`Admin authentication is unavailable. ${details}`);
  }
}

async function runSafeDatabaseInitialization() {
  const seedKey = 'initial_data_seed_v1';
  const existingSeed = await SiteSetting.findOne({ key: seedKey }).lean();

  if (existingSeed?.value?.status !== 'complete') {
    const [existingProduct, existingCategory, existingStore] = await Promise.all([
      Product.exists({}),
      Category.exists({}),
      Store.exists({})
    ]);

    if (existingProduct || isVercelDeployment || process.env.NODE_ENV === 'production') {
      console.log('Existing data found or production environment detected; skipping template seeding.');
      await SiteSetting.updateOne(
        { key: seedKey },
        {
          $set: {
            key: seedKey,
            value: {
              status: 'complete',
              skipped: true,
              reason: existingProduct ? 'existing_data_present' : 'production_environment',
              completedAt: new Date()
            }
          }
        },
        { upsert: true }
      );
    } else {
      console.log('Seeding initial data for fresh local development database...');
      await Promise.all([
        ...initialProducts.map((product) =>
          upsertIfMissing(Product, { id: product.id }, { $setOnInsert: product })
        ),
        ...initialCategories.map((category) =>
          upsertIfMissing(Category, { id: category.id }, { $setOnInsert: category })
        ),
        ...initialStores.map((store) =>
          upsertIfMissing(Store, { id: store.id }, { $setOnInsert: store })
        )
      ]);

      await SiteSetting.updateOne(
        { key: seedKey },
        { $set: { 'value.status': 'complete', 'value.completedAt': new Date() } },
        { upsert: true }
      );
    }
  }

  if (!(await SiteSetting.exists({ key: 'main_config' }))) {
    await upsertIfMissing(SiteSetting, { key: 'main_config' }, {
      $setOnInsert: { key: 'main_config', value: defaultSiteConfig }
    });
  }

  await migrateMonitorCategory();
  await migrateCategoryOrderAndCodingGear();
  await migrateProductOrdering();

  const authConfig = await ensureAdminAccount();
  if (!authConfig.valid) {
    const details = authConfig.missing?.length
      ? `Missing server-side environment variables: ${authConfig.missing.join(', ')}`
      : authConfig.error;
    console.warn(`Admin authentication note: ${details}`);
  }
}

async function migrateMonitorCategory() {
  const migrationKey = 'monitor_category_migration_v1';
  if (await SiteSetting.exists({ key: migrationKey })) return;

  const monitorProductCount = await Product.countDocuments({ category: 'monitors' });
  if (monitorProductCount > 0) {
    console.warn(`Skipped Monitors category migration because ${monitorProductCount} product(s) still use it.`);
    return;
  }

  await Category.updateMany(
    { $or: [{ id: 'monitors' }, { slug: 'monitors' }, { name: 'Monitors' }] },
    {
      $set: {
        id: 'collectibles-decor',
        name: 'Collectibles & Decor',
        slug: 'collectibles-decor',
        description: 'Posters, anime collectibles, action figures, keychains, and display pieces for expressive spaces.',
        iconName: 'Gift'
      }
    }
  );

  await upsertIfMissing(SiteSetting, { key: migrationKey }, {
    $setOnInsert: { key: migrationKey, value: { completedAt: new Date() } }
  });
}

async function migrateCategoryOrderAndCodingGear() {
  const migrationKey = 'category_order_coding_gear_migration_v1';
  if (await SiteSetting.exists({ key: migrationKey })) return;

  for (const category of initialCategories) {
    const isWorkspaceCategory = category.id === 'setup-workspace';
    const aliases = isWorkspaceCategory
      ? ['setup-workspace', 'coding-gear', 'Setup & Workspace', 'Coding Gear']
      : [category.id, category.slug, category.name];
    const { order, ...categoryFields } = category;
    const updates = {
      $set: { order, ...(isWorkspaceCategory ? categoryFields : {}) },
      ...(!isWorkspaceCategory ? { $setOnInsert: categoryFields } : {})
    };

    await upsertIfMissing(Category,
      { $or: [{ id: { $in: aliases } }, { slug: { $in: aliases } }, { name: { $in: aliases } }] },
      updates
    );
  }

  await Product.updateMany(
    { category: { $in: ['coding-gear', 'Coding Gear'] } },
    { $set: { category: 'setup-workspace', categoryName: 'Setup & Workspace' } }
  );

  await upsertIfMissing(SiteSetting, { key: migrationKey }, {
    $setOnInsert: { key: migrationKey, value: { completedAt: new Date() } }
  });
}

async function migrateProductOrdering() {
  const migrationKey = 'product_order_migration_v1';
  const migration = await SiteSetting.findOne({ key: migrationKey }).lean();

  if (!migration) {
    const featuredProducts = await Product.find({
      featured: true,
      $or: [{ featuredOrder: null }, { featuredOrder: { $exists: false } }]
    }).sort({ createdAt: -1, _id: 1 }).select('id').lean();
    let featuredOrder = await Product.findOne({ featuredOrder: { $ne: null } }).sort({ featuredOrder: -1 }).select('featuredOrder').lean();
    let nextFeaturedOrder = featuredOrder?.featuredOrder || 0;
    for (const product of featuredProducts) {
      nextFeaturedOrder += 1;
      await Product.updateOne({ id: product.id }, { $set: { featuredOrder: nextFeaturedOrder } });
    }

    const setupProducts = await Product.find({
      showInMySetup: true,
      $or: [{ setupOrder: null }, { setupOrder: { $exists: false } }]
    }).sort({ createdAt: -1, _id: 1 }).select('id').lean();
    const existingSetupOrder = await Product.findOne({ setupOrder: { $ne: null } }).sort({ setupOrder: -1 }).select('setupOrder').lean();
    let nextSetupOrder = existingSetupOrder?.setupOrder || 0;
    for (const product of setupProducts) {
      nextSetupOrder += 1;
      await Product.updateOne({ id: product.id }, { $set: { setupOrder: nextSetupOrder } });
    }

    await upsertIfMissing(SiteSetting, { key: migrationKey }, {
      $setOnInsert: { key: migrationKey, value: { completedAt: new Date() } }
    });
  }

  const [featuredMax, setupMax] = await Promise.all([
    Product.findOne({ featuredOrder: { $ne: null } }).sort({ featuredOrder: -1 }).select('featuredOrder').lean(),
    Product.findOne({ setupOrder: { $ne: null } }).sort({ setupOrder: -1 }).select('setupOrder').lean()
  ]);
  const counterKey = 'product_order_counters';
  const currentCounters = await SiteSetting.findOne({ key: counterKey }).lean();
  const maxFeaturedOrder = featuredMax?.featuredOrder || 0;
  const maxSetupOrder = setupMax?.setupOrder || 0;
  if (!currentCounters) {
    await upsertIfMissing(SiteSetting, { key: counterKey }, {
      $setOnInsert: {
        key: counterKey,
        value: { featuredOrder: maxFeaturedOrder, setupOrder: maxSetupOrder }
      }
    });
  } else if (
    (currentCounters.value?.featuredOrder || 0) < maxFeaturedOrder ||
    (currentCounters.value?.setupOrder || 0) < maxSetupOrder
  ) {
    await SiteSetting.updateOne({ key: counterKey }, {
      $max: {
        'value.featuredOrder': maxFeaturedOrder,
        'value.setupOrder': maxSetupOrder
      }
    });
  }
}

async function reserveProductOrder(counterField) {
  const counter = await SiteSetting.findOneAndUpdate(
    { key: 'product_order_counters' },
    { $inc: { [`value.${counterField}`]: 1 } },
    { upsert: true, returnDocument: 'after' }
  ).lean();
  return counter.value[counterField];
}

function nextMemoryProductOrder(field) {
  return memoryStore.products.reduce((maxOrder, product) => Math.max(maxOrder, product[field] || 0), 0) + 1;
}

// Data Access Methods
export const dbService = {
  // Products
  async getProducts(filters = {}) {
    if (isMongoConnected) {
      const query = {};
      if (filters.category && filters.category !== 'all') query.category = filters.category;
      if (filters.featured === true) query.featured = true;
      if (filters.showInMySetup === true) query.showInMySetup = true;
      if (filters.published !== undefined) query.published = filters.published;
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { brand: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }
      const order = filters.showInMySetup === true
        ? { setupOrder: 1, createdAt: -1 }
        : { featured: -1, featuredOrder: 1, createdAt: -1 };
      return await Product.find(query).sort(order);
    }

    if (isVercelDeployment || process.env.NODE_ENV === 'production') {
      throw new Error('Database is offline. MongoDB Atlas connection is required.');
    }

    console.warn('[dbService] Warning: Serving local memory fallback products because MongoDB is not connected.');
    let results = [...memoryStore.products];
    if (filters.category && filters.category !== 'all') {
      results = results.filter(p => p.category === filters.category);
    }
    if (filters.featured === true) {
      results = results.filter(p => p.featured);
    }
    if (filters.showInMySetup === true) {
      results = results.filter(p => p.showInMySetup === true);
    }
    if (filters.published !== undefined) {
      results = results.filter(p => p.published === filters.published);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    return results.sort((a, b) => {
      if (filters.showInMySetup === true) {
        return (a.setupOrder ?? Number.MAX_SAFE_INTEGER) - (b.setupOrder ?? Number.MAX_SAFE_INTEGER);
      }
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.featured && b.featured) return (a.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (b.featuredOrder ?? Number.MAX_SAFE_INTEGER);
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  },

  async getProductById(id) {
    if (isMongoConnected) {
      return await Product.findOne({ id }) || await Product.findById(id).catch(() => null);
    }
    return memoryStore.products.find(p => p.id === id) || null;
  },

  async createProduct(data) {
    const id = data.id || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    const img = data.imageUrl || data.image || '';
    const newProd = {
      ...data,
      image: img,
      imageUrl: img,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isMongoConnected) {
      if (newProd.featured) newProd.featuredOrder = await reserveProductOrder('featuredOrder');
      else newProd.featuredOrder = null;
      if (newProd.showInMySetup) newProd.setupOrder = await reserveProductOrder('setupOrder');
      else newProd.setupOrder = null;
      return await Product.create(newProd);
    }
    newProd.featuredOrder = newProd.featured ? nextMemoryProductOrder('featuredOrder') : null;
    newProd.setupOrder = newProd.showInMySetup ? nextMemoryProductOrder('setupOrder') : null;
    memoryStore.products.unshift(newProd);
    return newProd;
  },

  async updateProduct(id, data) {
    const img = data.imageUrl !== undefined ? data.imageUrl : data.image;
    const updated = {
      ...data,
      ...(img !== undefined ? { image: img, imageUrl: img } : {}),
      updatedAt: new Date().toISOString()
    };
    delete updated.featuredOrder;
    delete updated.setupOrder;

    if (isMongoConnected) {
      const existing = await Product.findOne({ id }).select('featured featuredOrder showInMySetup setupOrder').lean();
      if (!existing) return null;

      const nextFeatured = data.featured ?? existing.featured;
      if (nextFeatured && !existing.featured) updated.featuredOrder = await reserveProductOrder('featuredOrder');
      else if (!nextFeatured) updated.featuredOrder = null;
      else if (existing.featuredOrder == null) updated.featuredOrder = await reserveProductOrder('featuredOrder');

      const nextInSetup = data.showInMySetup ?? existing.showInMySetup;
      if (nextInSetup && !existing.showInMySetup) updated.setupOrder = await reserveProductOrder('setupOrder');
      else if (!nextInSetup) updated.setupOrder = null;
      else if (existing.setupOrder == null) updated.setupOrder = await reserveProductOrder('setupOrder');

      return await Product.findOneAndUpdate(
        { id },
        { $set: updated },
        { returnDocument: 'after', runValidators: true }
      );
    }

    const idx = memoryStore.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      const existing = memoryStore.products[idx];
      const nextFeatured = data.featured ?? existing.featured;
      if (nextFeatured && !existing.featured) updated.featuredOrder = nextMemoryProductOrder('featuredOrder');
      else if (!nextFeatured) updated.featuredOrder = null;
      else if (existing.featuredOrder == null) updated.featuredOrder = nextMemoryProductOrder('featuredOrder');
      const nextInSetup = data.showInMySetup ?? existing.showInMySetup;
      if (nextInSetup && !existing.showInMySetup) updated.setupOrder = nextMemoryProductOrder('setupOrder');
      else if (!nextInSetup) updated.setupOrder = null;
      else if (existing.setupOrder == null) updated.setupOrder = nextMemoryProductOrder('setupOrder');
      memoryStore.products[idx] = { ...memoryStore.products[idx], ...updated };
      return memoryStore.products[idx];
    }
    return null;
  },

  async deleteProduct(id) {
    if (isMongoConnected) {
      return await Product.findOneAndDelete({ id });
    }
    const idx = memoryStore.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      const removed = memoryStore.products.splice(idx, 1);
      return removed[0];
    }
    return null;
  },

  // Categories
  async getCategories() {
    if (isMongoConnected) {
      return await Category.find().sort({ order: 1, _id: 1 });
    }
    return memoryStore.categories;
  },

  async createCategory(cat) {
    const id = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
    const currentCategories = isMongoConnected
      ? await Category.find().select('order').lean()
      : memoryStore.categories;
    const nextOrder = currentCategories.reduce((maxOrder, category) => Math.max(maxOrder, category.order || 0), 0) + 1;
    const newCat = { ...cat, id, slug: id, order: cat.order ?? nextOrder };
    if (isMongoConnected) {
      return await Category.create(newCat);
    }
    memoryStore.categories.push(newCat);
    return newCat;
  },

  // Stores
  async getStores() {
    if (isMongoConnected) {
      return await Store.find();
    }
    return memoryStore.stores;
  },

  async createStore(store) {
    const id = store.id || store.name.toLowerCase().replace(/\s+/g, '-');
    const newStore = { ...store, id };
    if (isMongoConnected) {
      return await Store.create(newStore);
    }
    memoryStore.stores.push(newStore);
    return newStore;
  },

  // Site Settings
  async getSiteConfig() {
    if (isMongoConnected) {
      const doc = await SiteSetting.findOne({ key: 'main_config' });
      return doc ? doc.value : defaultSiteConfig;
    }
    return memoryStore.siteConfig;
  },

  async updateSiteConfig(newConfig) {
    if (isMongoConnected) {
      await SiteSetting.findOneAndUpdate(
        { key: 'main_config' },
        { key: 'main_config', value: newConfig, updatedBy: 'admin' },
        { upsert: true, new: true }
      );
    }
    memoryStore.siteConfig = { ...memoryStore.siteConfig, ...newConfig };
    return memoryStore.siteConfig;
  },

  // Collaboration Inquiries
  async createCollaborationInquiry(data) {
    const inquiryId = `inq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const inquiry = {
      inquiryId,
      brand: data.brand?.trim(),
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
      website: data.website?.trim() || '',
      collaborationType: data.collaborationType?.trim() || 'Product Feature & Review',
      message: data.message?.trim() || '',
      status: 'New',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (isMongoConnected) {
      return await CollaborationInquiry.create(inquiry);
    }

    memoryStore.collaborationInquiries = memoryStore.collaborationInquiries || [];
    memoryStore.collaborationInquiries.unshift(inquiry);
    return inquiry;
  },

  async getCollaborationInquiries() {
    if (isMongoConnected) {
      return await CollaborationInquiry.find().sort({ createdAt: -1 });
    }

    memoryStore.collaborationInquiries = memoryStore.collaborationInquiries || [];
    return [...memoryStore.collaborationInquiries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getCollaborationInquiryById(id) {
    if (isMongoConnected) {
      return await CollaborationInquiry.findOne({ inquiryId: id }) || await CollaborationInquiry.findById(id).catch(() => null);
    }

    memoryStore.collaborationInquiries = memoryStore.collaborationInquiries || [];
    return memoryStore.collaborationInquiries.find((item) => item.inquiryId === id) || null;
  },

  async updateCollaborationInquiryStatus(id, status) {
    const allowed = ['New', 'Contacted', 'In Discussion', 'Accepted', 'Rejected', 'Completed'];
    if (!allowed.includes(status)) {
      throw new Error('Invalid inquiry status');
    }

    if (isMongoConnected) {
      const updated = await CollaborationInquiry.findOneAndUpdate(
        { inquiryId: id },
        { status, updatedAt: new Date() },
        { new: true }
      );
      if (!updated) return null;
      return updated;
    }

    memoryStore.collaborationInquiries = memoryStore.collaborationInquiries || [];
    const index = memoryStore.collaborationInquiries.findIndex((item) => item.inquiryId === id);
    if (index === -1) return null;
    memoryStore.collaborationInquiries[index] = {
      ...memoryStore.collaborationInquiries[index],
      status,
      updatedAt: new Date()
    };
    return memoryStore.collaborationInquiries[index];
  },

  async deleteCollaborationInquiry(id) {
    if (isMongoConnected) {
      const deleted = await CollaborationInquiry.findOneAndDelete({ inquiryId: id });
      return deleted;
    }

    memoryStore.collaborationInquiries = memoryStore.collaborationInquiries || [];
    const index = memoryStore.collaborationInquiries.findIndex((item) => item.inquiryId === id);
    if (index === -1) return null;
    const [deleted] = memoryStore.collaborationInquiries.splice(index, 1);
    return deleted;
  },

  // Click Tracking Analytics
  async recordClick(clickData) {
    const record = {
      productId: clickData.productId || 'unknown',
      productName: clickData.productName || 'Direct Storefront Link',
      store: clickData.store || 'Amazon India',
      affiliateUrl: clickData.affiliateUrl || '',
      referrer: clickData.referrer || 'direct',
      deviceCategory: clickData.deviceCategory || 'desktop',
      timestamp: new Date()
    };

    if (isMongoConnected) {
      return await Click.create(record);
    }
    record.id = 'clk-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
    memoryStore.clicks.unshift(record);
    return record;
  },

  async getAnalyticsSummary() {
    const clicks = isMongoConnected
      ? await Click.find().sort({ timestamp: -1 }).limit(1000)
      : memoryStore.clicks;

    const totalClicks = clicks.length;

    // By product
    const productMap = {};
    const storeMap = {};
    const deviceMap = { desktop: 0, mobile: 0, tablet: 0 };

    clicks.forEach(c => {
      const pName = c.productName || 'Unknown Product';
      productMap[pName] = (productMap[pName] || 0) + 1;

      const sName = c.store || 'Direct Retail';
      storeMap[sName] = (storeMap[sName] || 0) + 1;

      const dev = c.deviceCategory || 'desktop';
      deviceMap[dev] = (deviceMap[dev] || 0) + 1;
    });

    const topProducts = Object.entries(productMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const storeBreakdown = Object.entries(storeMap)
      .map(([store, count]) => ({ store, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalClicks,
      topProducts,
      storeBreakdown,
      deviceBreakdown: deviceMap,
      recentClicks: clicks.slice(0, 15)
    };
  }
};
