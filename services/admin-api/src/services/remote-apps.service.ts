import { v4 as uuidv4 } from "uuid";
import { remoteAppsRepository } from "../repositories/remote-apps.repository.js";
import {
  type RemoteAppDto,
  type CreateRemoteAppInput,
  type UpdateRemoteAppInput,
  type ReorderAppsInput,
  toDto,
  toModel,
} from "../types/remote-app.js";
import logger from "../utils/logger.js";

export class RemoteAppsService {
  /**
   * Get all remote apps
   */
  async getAllApps(options?: {
    activeOnly?: boolean;
  }): Promise<RemoteAppDto[]> {
    logger.debug("Fetching all remote apps", { options });
    const apps = await remoteAppsRepository.findAll(options);
    return apps.map(toDto);
  }

  /**
   * Get a remote app by ID
   */
  async getAppById(id: string): Promise<RemoteAppDto | null> {
    logger.debug("Fetching remote app by ID", { id });
    const app = await remoteAppsRepository.findById(id);
    return app ? toDto(app) : null;
  }

  /**
   * Get a remote app by name
   */
  async getAppByName(name: string): Promise<RemoteAppDto | null> {
    logger.debug("Fetching remote app by name", { name });
    const app = await remoteAppsRepository.findByName(name);
    return app ? toDto(app) : null;
  }

  /**
   * Create a new remote app
   */
  async createApp(input: CreateRemoteAppInput): Promise<RemoteAppDto> {
    logger.info("Creating new remote app", { name: input.name });

    // Check for duplicate name
    const exists = await remoteAppsRepository.nameExists(input.name);
    if (exists) {
      throw new AppError(
        `Remote app with name '${input.name}' already exists`,
        409
      );
    }

    const modelData = toModel(input);
    const app = await remoteAppsRepository.create({
      id: uuidv4(),
      name: modelData.name!,
      title: modelData.title!,
      icon: modelData.icon || "Package",
      url: modelData.url!,
      scope: modelData.scope!,
      module: modelData.module!,
      is_active: modelData.is_active ?? true,
      display_order: modelData.display_order ?? 0,
    });

    logger.info("Remote app created successfully", {
      id: app.id,
      name: app.name,
    });
    return toDto(app);
  }

  /**
   * Update a remote app
   */
  async updateApp(
    id: string,
    input: UpdateRemoteAppInput
  ): Promise<RemoteAppDto | null> {
    logger.info("Updating remote app", { id });

    // Check if app exists
    const existing = await remoteAppsRepository.findById(id);
    if (!existing) {
      return null;
    }

    // Check for duplicate name if name is being changed
    if (input.name && input.name !== existing.name) {
      const nameExists = await remoteAppsRepository.nameExists(input.name, id);
      if (nameExists) {
        throw new AppError(
          `Remote app with name '${input.name}' already exists`,
          409
        );
      }
    }

    const modelData = toModel(input);
    const updated = await remoteAppsRepository.update(id, modelData);

    if (!updated) {
      return null;
    }

    logger.info("Remote app updated successfully", { id });
    return toDto(updated);
  }

  /**
   * Delete a remote app
   */
  async deleteApp(id: string): Promise<boolean> {
    logger.info("Deleting remote app", { id });

    const deleted = await remoteAppsRepository.delete(id);

    if (deleted) {
      logger.info("Remote app deleted successfully", { id });
    } else {
      logger.warn("Remote app not found for deletion", { id });
    }

    return deleted;
  }

  /**
   * Toggle active status of a remote app
   */
  async toggleAppActive(id: string): Promise<RemoteAppDto | null> {
    logger.info("Toggling remote app active status", { id });

    const updated = await remoteAppsRepository.toggleActive(id);

    if (!updated) {
      return null;
    }

    logger.info("Remote app active status toggled", {
      id,
      isActive: updated.is_active,
    });
    return toDto(updated);
  }

  /**
   * Reorder remote apps
   */
  async reorderApps(input: ReorderAppsInput): Promise<RemoteAppDto[]> {
    logger.info("Reordering remote apps", { count: input.orders.length });

    await remoteAppsRepository.updateDisplayOrders(
      input.orders.map((o) => ({ id: o.id, displayOrder: o.displayOrder }))
    );

    return this.getAllApps();
  }
}

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const remoteAppsService = new RemoteAppsService();
