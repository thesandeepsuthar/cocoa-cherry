import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly'],
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    trim: true,
    maxlength: [300, 'Excerpt cannot exceed 300 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
  },
  coverImage: {
    type: String, // Cloudinary URL
    required: [true, 'Cover image is required'],
  },
  coverImagePublicId: {
    type: String, // Cloudinary public_id for deletion
    default: null,
  },
  author: {
    type: String,
    default: 'Cocoa&Cherry Team',
    trim: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  readTime: {
    type: Number, // in minutes
    default: 5,
    min: [1, 'Read time must be at least 1 minute'],
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  category: {
    type: String,
    trim: true,
    default: 'General',
  },
  views: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'SEO title should be under 60 characters'],
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'SEO description should be under 160 characters'],
  },
}, {
  timestamps: true,
});

// Index for common queries
BlogSchema.index({ slug: 1 });
BlogSchema.index({ isActive: 1, isPublished: 1, publishedAt: -1 });
BlogSchema.index({ category: 1, isActive: 1 });

// Virtual for formatted date
BlogSchema.virtual('formattedDate').get(function() {
  return this.publishedAt.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
