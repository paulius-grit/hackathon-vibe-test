import type { Request, Response } from "express";
import db from "../database/db.js";
import logger from "../utils/logger.js";

export class HealthController {
  /**
   * GET /api/health
   * Health check endpoint
   */
  async check(_req: Request, res: Response): Promise<void> {
    try {
      // Check database health
      const isHealthy = await db.checkHealth();

      if (isHealthy) {
        res.json({
          success: true,
          data: {
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || "development",
          },
        });
      } else {
        throw new Error("Database check failed");
      }
    } catch (error) {
      logger.error("Health check failed", error);
      res.status(503).json({
        success: false,
        data: {
          status: "unhealthy",
          timestamp: new Date().toISOString(),
          error: "Database connection failed",
        },
      });
    }
  }
}

export const healthController = new HealthController();
