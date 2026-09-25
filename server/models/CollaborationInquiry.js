import mongoose from 'mongoose';

const inquiryStatusValues = ['New', 'Contacted', 'In Discussion', 'Accepted', 'Rejected', 'Completed'];

const collaborationInquirySchema = new mongoose.Schema({
  inquiryId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  website: {
    type: String,
    default: '',
    trim: true
  },
  collaborationType: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: inquiryStatusValues,
    default: 'New',
    index: true
  }
}, {
  timestamps: true
});

collaborationInquirySchema.index({ createdAt: -1 });

export const CollaborationInquiry = mongoose.models.CollaborationInquiry || mongoose.model('CollaborationInquiry', collaborationInquirySchema);
