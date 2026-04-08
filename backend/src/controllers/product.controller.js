import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    data: { products }
  });
});
