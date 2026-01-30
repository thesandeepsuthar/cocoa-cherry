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
    type: String, // Cloudinary URL (optional)
    default: null,
  },
  avatarPublicId: {
    type: String, // Cloudinary public_id for deletion
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

