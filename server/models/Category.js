import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
  description: { type: String, default: '' },
  iconName: { type: String, default: 'Layers' },
  featured: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
