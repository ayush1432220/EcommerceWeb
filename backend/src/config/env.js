import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const schema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
  PORT: Joi.number().port().default(5000),
  MONGODB_URI: Joi.string().uri().required(),
  CLIENT_URL: Joi.string().uri().required(),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_EMAIL_VERIFY_SECRET: Joi.string().min(32).required(),
  JWT_PASSWORD_RESET_SECRET: Joi.string().min(32).required(),
  ACCESS_TOKEN_TTL: Joi.string().default("15m"),
  REFRESH_TOKEN_TTL: Joi.string().default("7d"),
  EMAIL_VERIFY_TOKEN_TTL_MINUTES: Joi.number().integer().min(5).default(60),
  PASSWORD_RESET_TOKEN_TTL_MINUTES: Joi.number().integer().min(5).default(15),
  BCRYPT_SALT_ROUNDS: Joi.number().integer().min(10).default(12),
  LOG_LEVEL: Joi.string().default("info"),
  COOKIE_SECURE: Joi.boolean().truthy("true").falsy("false").default(false),
  MONGODB_SERVER_SELECTION_TIMEOUT_MS: Joi.number().integer().min(1000).default(5000)
}).unknown();

const { value, error } = schema.validate(process.env, {
  abortEarly: false,
  convert: true
});

if (error) {
  throw new Error(`Environment validation failed: ${error.message}`);
}

export const env = value;
