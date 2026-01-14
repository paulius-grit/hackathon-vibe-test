import type { Request, Response, NextFunction } from "express";
import {
  remoteAppsService,
  AppError,
} from "../services/remote-apps.service.js";
import {
  createRemoteAppSchema,
  updateRemoteAppSchema,
  reorderAppsSchema,
} from "../types/remote-app.js";
import logger from "../utils/logger.js";

export class RemoteAppsController {
  /**
   * GET /api/remote-apps
   * List all remote apps
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activeOnly = req.query.active === "true";
      const apps = await remoteAppsService.getAllApps({ activeOnly });
      res.json({ success: true, data: apps });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/remote-apps/:id
   * Get a single remote app by ID
   */
  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const app = await remoteAppsService.getAppById(id);

      if (!app) {
        res.status(404).json({
          success: false,
          error: { message: "Remote app not found", code: "NOT_FOUND" },
        });
        return;
      }

      res.json({ success: true, data: app });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/remote-apps
   * Create a new remote app
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validationResult = createRemoteAppSchema.safeParse(req.body);

      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: {
            message: "Validation failed",
            code: "VALIDATION_ERROR",
            details: validationResult.error.errors,
          },
        });
        return;
      }

      const app = await remoteAppsService.createApp(validationResult.data);
      res.status(201).json({ success: true, data: app });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: { message: error.message, code: "APP_ERROR" },
        });
        return;
      }
      next(error);
    }
  }

  /**
   * PUT /api/remote-apps/:id
   * Update a remote app
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validationResult = updateRemoteAppSchema.safeParse(req.body);

      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: {
            message: "Validation failed",
            code: "VALIDATION_ERROR",
            details: validationResult.error.errors,
          },
        });
        return;
      }

      const app = await remoteAppsService.updateApp(id, validationResult.data);

      if (!app) {
        res.status(404).json({
          success: false,
          error: { message: "Remote app not found", code: "NOT_FOUND" },
        });
        return;
      }

      res.json({ success: true, data: app });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: { message: error.message, code: "APP_ERROR" },
        });
        return;
      }
      next(error);
    }
  }

  /**
   * DELETE /api/remote-apps/:id
   * Delete a remote app
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await remoteAppsService.deleteApp(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: { message: "Remote app not found", code: "NOT_FOUND" },
        });
        return;
      }

      res.json({ success: true, message: "Remote app deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/remote-apps/:id/toggle
   * Toggle active status of a remote app
   */
  async toggleActive(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const app = await remoteAppsService.toggleAppActive(id);

      if (!app) {
        res.status(404).json({
          success: false,
          error: { message: "Remote app not found", code: "NOT_FOUND" },
        });
        return;
      }

      res.json({ success: true, data: app });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/remote-apps/reorder
   * Reorder remote apps
   */
  async reorder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validationResult = reorderAppsSchema.safeParse(req.body);

      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: {
            message: "Validation failed",
            code: "VALIDATION_ERROR",
            details: validationResult.error.errors,
          },
        });
        return;
      }

      const apps = await remoteAppsService.reorderApps(validationResult.data);
      res.json({ success: true, data: apps });
    } catch (error) {
      next(error);
    }
  }
}

export const remoteAppsController = new RemoteAppsController();
