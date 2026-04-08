import mongoose from "mongoose";

import { env } from "./env.js";
import { logger } from "./logger.js";
import { Product } from "../models/Product.js";
import sampleProducts from "../data/sampleProducts.js";

export const connectDatabase = async () => {
  mongoose.set("strictQuery", true);

  logger.info("Connecting to MongoDB", {
    uri: env.MONGODB_URI,
    serverSelectionTimeoutMs: env.MONGODB_SERVER_SELECTION_TIMEOUT_MS
  });

  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== "production",
    serverSelectionTimeoutMS: env.MONGODB_SERVER_SELECTION_TIMEOUT_MS
  });

  logger.info("MongoDB connected");

  const existingProducts = await Product.countDocuments();
  if (existingProducts === 0) {
    await Product.create(sampleProducts);
    logger.info("Seeded sample products into MongoDB");
  }
};
