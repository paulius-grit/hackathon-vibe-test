import db from "../database/db.js";
import type { RemoteAppModel } from "../types/remote-app.js";

export class RemoteAppsRepository {
  /**
   * Find all remote apps
   */
  async findAll(options?: { activeOnly?: boolean }): Promise<RemoteAppModel[]> {
    let apps = db.getRemoteApps();

    if (options?.activeOnly) {
      apps = apps.filter((app) => app.is_active);
    }

    // Sort by display order
    return apps.sort((a, b) => a.display_order - b.display_order);
  }

  /**
   * Find a remote app by ID
   */
  async findById(id: string): Promise<RemoteAppModel | undefined> {
    const apps = db.getRemoteApps();
    return apps.find((app) => app.id === id);
  }

  /**
   * Find a remote app by name
   */
  async findByName(name: string): Promise<RemoteAppModel | undefined> {
    const apps = db.getRemoteApps();
    return apps.find((app) => app.name === name);
  }

  /**
   * Create a new remote app
   */
  async create(
    data: Omit<RemoteAppModel, "created_at" | "updated_at">
  ): Promise<RemoteAppModel> {
    const now = new Date();
    const record: RemoteAppModel = {
      ...data,
      created_at: now,
      updated_at: now,
    };

    db.addRemoteApp(record);
    return record;
  }

  /**
   * Update a remote app
   */
  async update(
    id: string,
    data: Partial<Omit<RemoteAppModel, "id" | "created_at" | "updated_at">>
  ): Promise<RemoteAppModel | undefined> {
    const updateData = {
      ...data,
      updated_at: new Date(),
    };

    const success = db.updateRemoteApp(id, updateData);
    if (!success) return undefined;

    return this.findById(id);
  }

  /**
   * Delete a remote app
   */
  async delete(id: string): Promise<boolean> {
    return db.deleteRemoteApp(id);
  }

  /**
   * Update display order for multiple apps
   */
  async updateDisplayOrders(
    orders: Array<{ id: string; displayOrder: number }>
  ): Promise<void> {
    for (const { id, displayOrder } of orders) {
      db.updateRemoteApp(id, {
        display_order: displayOrder,
        updated_at: new Date(),
      });
    }
  }

  /**
   * Toggle active status
   */
  async toggleActive(id: string): Promise<RemoteAppModel | undefined> {
    const app = await this.findById(id);
    if (!app) return undefined;

    db.updateRemoteApp(id, {
      is_active: !app.is_active,
      updated_at: new Date(),
    });

    return this.findById(id);
  }

  /**
   * Check if a name already exists (for uniqueness validation)
   */
  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    const apps = db.getRemoteApps();
    return apps.some((app) => app.name === name && app.id !== excludeId);
  }
}

export const remoteAppsRepository = new RemoteAppsRepository();
