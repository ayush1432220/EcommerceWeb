import { Router } from "express";

import adminRoutes from "./admin.routes.js";
import authRoutes from "./auth.routes.js";
import cartRoutes from "./cart.routes.js";
import productRoutes from "./product.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use(
  "/auth",
  (req, res, next) => {
    console.log("Incoming request to auth routes:");
    next();
  },
  authRoutes
);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);

export default router;
