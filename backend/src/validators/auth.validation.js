import Joi from "joi";

const passwordPolicy = Joi.string()
  .min(12)
  .max(128)
  .pattern(/[a-z]/, "lowercase")
  .pattern(/[A-Z]/, "uppercase")
  .pattern(/[0-9]/, "number")
  .pattern(/[^A-Za-z0-9]/, "special character");

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: passwordPolicy.required()
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().max(128).required()
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required()
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: passwordPolicy.required()
});

export const emailTokenSchema = Joi.object({
  token: Joi.string().required()
});
