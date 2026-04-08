import mongoose from "mongoose";
import { env } from "./config/env.js";
import { Product } from "./models/Product.js";
import sampleProducts from "./data/sampleProducts.js";

const seedDatabase = async () => {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== "production",
    serverSelectionTimeoutMS: env.MONGODB_SERVER_SELECTION_TIMEOUT_MS
  });

  console.log("Dropping existing database...");
  await mongoose.connection.db.dropDatabase();

  console.log(`Seeding ${sampleProducts.length} products...`);
  await Product.create(sampleProducts);

  console.log("Seed complete.");
  await mongoose.disconnect();
};

seedDatabase()
  .then(() => {
    console.log("Database reset and seeded successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Database seeding failed:", error);
    process.exit(1);
  });
