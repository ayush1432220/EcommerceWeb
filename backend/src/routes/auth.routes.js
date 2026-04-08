import { Router } from "express";

import {
  forgotPassword,
  login,
  logout,
  refresh,
  register,
  resetPassword,
  verifyEmail
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  emailTokenSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema
} from "../validators/auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/verify-email", validate(emailTokenSchema), verifyEmail);
router.post("/login", validate(loginSchema), login);
router.post("/logout", validate(refreshTokenSchema), logout);
router.post("/refresh-token", validate(refreshTokenSchema), refresh);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
