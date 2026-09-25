import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['superadmin', 'admin', 'editor'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  avatar: { type: String, default: '' },
  lastLogin: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
