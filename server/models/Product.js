import mongoose from 'mongoose';

const specificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  image: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  category: { type: String, required: true, index: true },
  categoryName: { type: String, default: '' },
  platform: { type: String, default: 'Amazon' },
  storeName: { type: String, default: 'Amazon' },
  affiliateUrl: { type: String, required: true, trim: true },
  couponCode: { type: String, default: '', trim: true },
  price: { type: Number, default: null },
  currency: { type: String, default: '₹' },
  originalPrice: { type: Number, default: null },
  discount: { type: String, default: '' },
  rating: { type: Number, default: null },
  reviewCount: { type: Number, default: null },
  featured: { type: Boolean, default: false, index: true },
  featuredOrder: { type: Number, default: null },
  published: { type: Boolean, default: true, index: true },
  showInMySetup: { type: Boolean, default: false },
  setupTags: { type: [String], default: [] },
  setupOrder: { type: Number, default: null },
  tags: [{ type: String }],
  specifications: [specificationSchema]
}, {
  timestamps: true
});

productSchema.index({ category: 1, published: 1 });
productSchema.index({ featured: 1, published: 1 });
productSchema.index({ featured: 1, featuredOrder: 1, createdAt: -1 });
productSchema.index({ showInMySetup: 1, published: 1, setupOrder: 1 });
productSchema.index({ createdAt: -1 });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
