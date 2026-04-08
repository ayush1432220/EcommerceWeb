import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import { xss } from "express-xss-sanitizer";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/notFound.middleware.js";
import routes from "./routes/index.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use(
  cors({
    origin: [env.CLIENT_URL],
    credentials: false,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"]
  })
);

// Global throttling reduces automated abuse across the API surface.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests, please try again later."
    }
  })
);

// Apply a stricter limit only to endpoints that accept credentials or reset tokens.
const authAttemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later."
  }
});

app.use("/api/auth/login", authAttemptLimiter);
app.use("/api/auth/register", authAttemptLimiter);
app.use("/api/auth/verify-email", authAttemptLimiter);
app.use("/api/auth/forgot-password", authAttemptLimiter);
app.use("/api/auth/reset-password", authAttemptLimiter);
app.use("/api/auth/refresh-token", authAttemptLimiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload"
    });
  }

  next(err);
});

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Service healthy"
  });
});

app.use(
  "/api",
  (req, _res, next) => {
    logger.info("Incoming request to API routes", {
      method: req.method,
      path: req.originalUrl
    });
    next();
  },
  routes
);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
