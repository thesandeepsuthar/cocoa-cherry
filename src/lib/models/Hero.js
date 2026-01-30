import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema({
  imageData: {
    type: String, // Cloudinary URL
    required: true,
  },
  publicId: {
    type: String, // Cloudinary public_id for deletion
    default: null,
  },
  title: {
    type: String,
    default: 'Artisanal Cakes',
  },
  subtitle: {
    type: String,
    default: 'Handcrafted with Love',
  },
  alt: {
    type: String,
    default: 'Hero image for Cocoa & Cherry bakery',
  },
  order: {
    type: Number,
    default: 0,
    index: true, // faster sorting
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true, // faster filtering
  },
}, {
  timestamps: true,
  collection: 'heros', // explicitly set collection name
});

// Compound index for common queries
HeroSchema.index({ isActive: 1, order: 1, createdAt: -1 });

export default mongoose.models.Hero || mongoose.model('Hero', HeroSchema);
