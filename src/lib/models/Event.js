import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters'],
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true,
    maxlength: [200, 'Venue cannot exceed 200 characters'],
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  images: [{
    type: String, // Base64 encoded images
    required: true,
  }],
  coverImage: {
    type: String, // Base64 encoded cover image (first/main image)
    required: [true, 'Cover image is required'],
  },
  highlights: {
    type: String, // Short highlights like "500+ students served"
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
}, {
  timestamps: true,
});

// Compound index for common query pattern
EventSchema.index({ isActive: 1, order: 1, date: -1 });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
