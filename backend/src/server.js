import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const start = async () => {
  try {
    logger.info("Starting API server");
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(`API listening on port ${env.PORT}`);
      logger.info(`API listening on port ${env.PORT}`);
    });

    server.on("error", (error) => {
      logger.error("HTTP server failed to start", {
        error: error.message,
        code: error.code,
        port: env.PORT
      });
      process.exit(1);
    });
  } catch (error) {
    logger.error("Failed to start server", { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

start();
