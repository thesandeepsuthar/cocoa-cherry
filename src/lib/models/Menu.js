import mongoose from 'mongoose';

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  imageData: {
    type: String, // Cloudinary URL
    required: [true, 'Image is required'],
  },
  publicId: {
    type: String, // Cloudinary public_id for deletion
    default: null,
  },
  badge: {
    type: String, // "Best Seller", "New", etc.
    default: null,
    trim: true,
  },
  price: {
    type: Number, // Original price in INR
    default: 0,
    min: [0, 'Price cannot be negative'],
  },
  discountPrice: {
    type: Number, // Discounted price (if any)
    default: null,
    min: [0, 'Discount price cannot be negative'],
  },
  priceUnit: {
    type: String, // "per kg", "per piece", "per box", etc.
    default: 'per kg',
    trim: true,
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

// Virtual to check if item has discount
MenuSchema.virtual('hasDiscount').get(function() {
  return this.discountPrice !== null && this.discountPrice < this.price;
});

// Virtual to calculate discount percentage
MenuSchema.virtual('discountPercentage').get(function() {
  if (this.hasDiscount) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
