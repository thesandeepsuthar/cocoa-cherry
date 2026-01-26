import mongoose from "mongoose";

const HeroSchema = new mongoose.Schema(
  {
    imageData: {
      type: String, // Base64 encoded image
      required: true,
    },
    title: {
      type: String,
      default: "Artisanal Cakes",
    },
    subtitle: {
      type: String,
      default: "Handcrafted with Love",
    },
    alt: {
      type: String,
      default: "Hero image for Cocoa & Cherry bakery",
    },
    isActive: {
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
  },
);

// Ensure only one active hero image at a time (optional - comment out if you want multiple)
HeroSchema.pre("save", async function (next) {
  if (this.isActive && this.isNew) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false },
    );
  }
  next();
});

export default mongoose.models.Hero || mongoose.model("Hero", HeroSchema);
