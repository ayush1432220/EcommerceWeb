import Joi from "joi";

const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

export const addCartItemSchema = Joi.object({
  productId: objectIdSchema.required(),
  quantity: Joi.number().integer().min(1).max(1000).default(1)
});

export const updateCartItemSchema = Joi.object({
  productId: objectIdSchema.required(),
  quantity: Joi.number().integer().min(1).max(1000).required()
});

export const removeCartItemParamsSchema = Joi.object({
  id: objectIdSchema.required()
});
