import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  imageData: {
    type: String, // Base64 encoded image
    required: true,
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
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);

