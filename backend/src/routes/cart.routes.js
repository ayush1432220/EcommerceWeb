import { Router } from "express";

import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem
} from "../controllers/cart.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  addCartItemSchema,
  removeCartItemParamsSchema,
  updateCartItemSchema
} from "../validators/cart.validation.js";

const router = Router();

router.use(authenticate);

router.get("/", getCart);
router.post("/add", validate(addCartItemSchema), addCartItem);
router.put("/update", validate(updateCartItemSchema), updateCartItem);
router.delete("/remove/:id", validate(removeCartItemParamsSchema, "params"), removeCartItem);
router.delete("/clear", clearCart);

export default router;
