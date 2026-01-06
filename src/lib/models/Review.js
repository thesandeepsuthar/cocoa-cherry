import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cakeType: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
  },
  avatarData: {
    type: String, // Base64 encoded avatar (optional)
    default: null,
  },
  isApproved: {
    type: Boolean,
    default: false, // Admin must approve before showing
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);

