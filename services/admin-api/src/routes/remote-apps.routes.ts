import { Router } from "express";
import { remoteAppsController } from "../controllers/remote-apps.controller.js";

const router = Router();

// List all remote apps
router.get("/", (req, res, next) =>
  remoteAppsController.getAll(req, res, next)
);

// Reorder remote apps (must be before /:id routes)
router.patch("/reorder", (req, res, next) =>
  remoteAppsController.reorder(req, res, next)
);

// Get a single remote app
router.get("/:id", (req, res, next) =>
  remoteAppsController.getById(req, res, next)
);

// Create a new remote app
router.post("/", (req, res, next) =>
  remoteAppsController.create(req, res, next)
);

// Update a remote app
router.put("/:id", (req, res, next) =>
  remoteAppsController.update(req, res, next)
);

// Delete a remote app
router.delete("/:id", (req, res, next) =>
  remoteAppsController.delete(req, res, next)
);

// Toggle active status
router.patch("/:id/toggle", (req, res, next) =>
  remoteAppsController.toggleActive(req, res, next)
);

export default router;
