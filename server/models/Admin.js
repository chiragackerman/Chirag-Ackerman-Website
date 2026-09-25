import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin', 'editor'], default: 'admin' },
  avatar: { type: String, default: '' },
  lastLogin: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
