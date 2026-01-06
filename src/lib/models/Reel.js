import mongoose from 'mongoose';

const ReelSchema = new mongoose.Schema({
  videoUrl: {
    type: String, // Instagram/YouTube reel link
    required: true,
  },
  thumbnailData: {
    type: String, // Base64 encoded thumbnail image
    required: true,
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

