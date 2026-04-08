import { logger } from "../config/logger.js";

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    logger.error(err.message, { stack: err.stack });
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? "Internal server error" : err.message,
    ...(err.details ? { details: err.details } : {})
  });
};
