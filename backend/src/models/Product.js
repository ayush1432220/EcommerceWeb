import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    oldPrice: {
      type: Number,
      min: 0,
      default: null
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    emoji: {
      type: String,
      trim: true,
      maxlength: 4,
      default: "📦"
    },
    cat: {
      type: String,
      trim: true,
      maxlength: 60,
      default: "General"
    },
    brand: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "Store"
    },
    stars: {
      type: Number,
      min: 0,
      max: 5,
      default: 4
    },
    badge: {
      type: String,
      trim: true,
      default: "new"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Product = mongoose.model("Product", productSchema);
