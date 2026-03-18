import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Menu",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

cartSchema.pre("save", async function () {
  this.totalItems = this.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  this.totalAmount = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
});

cartSchema.index({ user: 1 });

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
