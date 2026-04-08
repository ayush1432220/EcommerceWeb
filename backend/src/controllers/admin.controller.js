import { Product } from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    data: { products }
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    message: "Product created",
    data: { product }
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.productId, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json({
    success: true,
    message: "Product updated",
    data: { product }
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json({
    success: true,
    message: "Product deleted"
  });
});
