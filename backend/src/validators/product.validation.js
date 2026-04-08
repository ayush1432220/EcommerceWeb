import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(160).required(),
  description: Joi.string().trim().min(10).max(5000).required(),
  price: Joi.number().precision(2).min(0).required(),
  oldPrice: Joi.number().precision(2).min(0).optional().allow(null),
  stock: Joi.number().integer().min(0).required(),
  emoji: Joi.string().trim().max(4).optional(),
  cat: Joi.string().trim().max(60).optional(),
  brand: Joi.string().trim().max(80).optional(),
  stars: Joi.number().integer().min(0).max(5).optional(),
  badge: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional()
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(160).optional(),
  description: Joi.string().trim().min(10).max(5000).optional(),
  price: Joi.number().precision(2).min(0).optional(),
  oldPrice: Joi.number().precision(2).min(0).optional().allow(null),
  stock: Joi.number().integer().min(0).optional(),
  emoji: Joi.string().trim().max(4).optional(),
  cat: Joi.string().trim().max(60).optional(),
  brand: Joi.string().trim().max(80).optional(),
  stars: Joi.number().integer().min(0).max(5).optional(),
  badge: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional()
}).min(1);
