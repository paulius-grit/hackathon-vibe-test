import "dotenv/config";
import app from "./app.js";
import db from "./database/db.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 4000;

async function startServer(): Promise<void> {
  try {
    // Test database
    const isHealthy = await db.checkHealth();
    if (isHealthy) {
      logger.info("Database connection established");
    } else {
      throw new Error("Database health check failed");
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Admin API server running on http://localhost:${PORT}`);
      logger.info(`📚 API endpoints available at http://localhost:${PORT}/api`);
      logger.info(`❤️  Health check at http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully...");
  process.exit(0);
});

startServer();
