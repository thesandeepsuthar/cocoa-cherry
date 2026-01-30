import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  imageData: {
    type: String, // Cloudinary URL
    required: true,
  },
  publicId: {
    type: String, // Cloudinary public_id for deletion
    default: null,
  },
  caption: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
    index: true, // Add index for faster sorting
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true, // Add index for filtering
  },
}, {
  timestamps: true,
});

// Compound index for the common query pattern
GallerySchema.index({ isActive: 1, order: 1, createdAt: -1 });

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);

