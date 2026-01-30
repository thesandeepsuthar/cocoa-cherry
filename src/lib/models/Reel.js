import mongoose from 'mongoose';

const ReelSchema = new mongoose.Schema({
  videoUrl: {
    type: String, // Instagram/YouTube reel link
    required: true,
  },
  thumbnailData: {
    type: String, // Cloudinary URL
    required: true,
  },
  thumbnailPublicId: {
    type: String, // Cloudinary public_id for deletion
    default: null,
  },
  caption: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Reel || mongoose.model('Reel', ReelSchema);

