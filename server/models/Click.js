import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  productId: { type: String, required: true, index: true },
  productName: { type: String, required: true },
  store: { type: String, default: 'Direct', index: true },
  affiliateUrl: { type: String, required: true },
  referrer: { type: String, default: 'direct' },
  deviceCategory: { type: String, default: 'desktop' },
  timestamp: { type: Date, default: Date.now, index: true }
}, {
  timestamps: true
});

clickSchema.index({ timestamp: -1, productId: 1 });

export const Click = mongoose.models.Click || mongoose.model('Click', clickSchema);
