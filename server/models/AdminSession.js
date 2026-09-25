import mongoose from 'mongoose';

const adminSessionSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true, unique: true, index: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
}, {
  timestamps: true
});

export const AdminSession = mongoose.models.AdminSession || mongoose.model('AdminSession', adminSessionSchema);