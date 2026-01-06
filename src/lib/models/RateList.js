import mongoose from 'mongoose';

const RateListSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    item: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    unit: {
      type: String,
      default: 'per kg',
      enum: ['per kg', 'per piece', 'per box', 'per dozen', 'per set', 'per serving'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.RateList || mongoose.model('RateList', RateListSchema);


