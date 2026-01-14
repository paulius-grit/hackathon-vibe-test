import { Router } from "express";
import { healthController } from "../controllers/health.controller.js";
import remoteAppsRoutes from "./remote-apps.routes.js";

const router = Router();

// Health check
router.get("/health", (req, res) => healthController.check(req, res));

// Remote apps CRUD
router.use("/remote-apps", remoteAppsRoutes);

export default router;
