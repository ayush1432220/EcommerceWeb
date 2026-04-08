import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct
} from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProductSchema, updateProductSchema } from "../validators/product.validation.js";

const router = Router();

router.use(authenticate, authorizeRoles("admin"));
router.get("/products", listProducts);
router.post("/products", validate(createProductSchema), createProduct);
router.patch("/products/:productId", validate(updateProductSchema), updateProduct);
router.delete("/products/:productId", deleteProduct);

export default router;
