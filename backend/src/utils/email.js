import { logger } from "../config/logger.js";

export const sendEmail = async ({ to, subject, text }) => {
  // Intentionally logs instead of sending so secrets do not leak to third parties during development.
  logger.info("Email dispatch placeholder", { to, subject, text });
};
