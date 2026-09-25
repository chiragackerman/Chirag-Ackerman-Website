import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Affiliate' },
  description: { type: String, default: '' },
  url: { type: String, required: true },
  badge: { type: String, default: '' },
  color: { type: String, default: '#8B5CF6' }
}, {
  timestamps: true
});

export const Store = mongoose.models.Store || mongoose.model('Store', storeSchema);
