import winston from "winston";

import { env } from "./env.js";

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const devFormat = printf(({ level, message, timestamp: time, stack, ...meta }) => {
  const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `${time} ${level}: ${stack || message}${extra}`;
});

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [
    new winston.transports.Console({
      format:
        env.NODE_ENV === "production"
          ? combine(timestamp(), errors({ stack: true }), json())
          : combine(colorize(), timestamp(), errors({ stack: true }), devFormat)
    })
  ],
  exitOnError: false
});
