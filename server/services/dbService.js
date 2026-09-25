import mongoose from 'mongoose';
import { initialProducts } from '../../src/data/initialProducts.js';
import { initialCategories } from '../../src/data/initialCategories.js';
import { initialStores } from '../../src/data/initialStores.js';
import { defaultSiteConfig } from '../../src/data/defaultSiteConfig.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Store } from '../models/Store.js';
import { Click } from '../models/Click.js';
import { SiteSetting } from '../models/SiteSetting.js';

let isMongoConnected = false;

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

export async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      console.log('Attempting MongoDB connection...');
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3000
      });
      isMongoConnected = true;
      console.log('Connected to MongoDB successfully.');
      await seedMongoIfEmpty();
      return;
    } catch (err) {
      console.warn('MongoDB connection failed. Operating in high-reliability memory storage mode:', err.message);
      isMongoConnected = false;
    }
  } else {
    console.log('No MONGODB_URI provided in environment. Operating in memory repository mode.');
  }
}

async function seedMongoIfEmpty() {
  if (!isMongoConnected) return;
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding initial products into MongoDB...');
      await Product.insertMany(initialProducts);
    }

    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      await Category.insertMany(initialCategories);
    }

    const storeCount = await Store.countDocuments();
    if (storeCount === 0) {
      await Store.insertMany(initialStores);
    }

    const setting = await SiteSetting.findOne({ key: 'main_config' });
    if (!setting) {
      await SiteSetting.create({ key: 'main_config', value: defaultSiteConfig });
    }
  } catch (e) {
    console.warn('Error during MongoDB seeding:', e.message);
  }
}

// Data Access Methods
export const dbService = {
  // Products
  async getProducts(filters = {}) {
    if (isMongoConnected) {
      const query = {};
      if (filters.category && filters.category !== 'all') query.category = filters.category;
      if (filters.featured === true) query.featured = true;
      if (filters.published !== undefined) query.published = filters.published;
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { brand: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }
      return await Product.find(query).sort({ createdAt: -1 });
    }

    let results = [...memoryStore.products];
    if (filters.category && filters.category !== 'all') {
      results = results.filter(p => p.category === filters.category);
    }
    if (filters.featured === true) {
      results = results.filter(p => p.featured);
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
    return results;
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
      return await Product.create(newProd);
    }
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

    if (isMongoConnected) {
      return await Product.findOneAndUpdate({ id }, updated, { new: true });
    }

    const idx = memoryStore.products.findIndex(p => p.id === id);
    if (idx !== -1) {
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
      return await Category.find();
    }
    return memoryStore.categories;
  },

  async createCategory(cat) {
    const id = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
    const newCat = { ...cat, id, slug: id };
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
