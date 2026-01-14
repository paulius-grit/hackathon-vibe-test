import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { RemoteAppModel } from "../types/remote-app.js";
import logger from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "..", "..", "data");
const DB_FILE = path.join(DATA_DIR, "remote-apps.json");

export interface Database {
  remoteApps: RemoteAppModel[];
}

/**
 * Simple JSON file-based database
 * Can be replaced with a real database later
 */
class JsonDatabase {
  private data: Database = { remoteApps: [] };

  constructor() {
    this.ensureDataDir();
    this.load();
  }

  private ensureDataDir(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      logger.info("Created data directory");
    }
  }

  private load(): void {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(content);
        logger.info(
          `Loaded ${this.data.remoteApps.length} remote apps from database`
        );
      } else {
        this.data = { remoteApps: [] };
        this.save();
        logger.info("Created new database file");
      }
    } catch (error) {
      logger.error("Failed to load database", error);
      this.data = { remoteApps: [] };
    }
  }

  private save(): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (error) {
      logger.error("Failed to save database", error);
      throw error;
    }
  }

  /**
   * Get all remote apps
   */
  getRemoteApps(): RemoteAppModel[] {
    return [...this.data.remoteApps];
  }

  /**
   * Set all remote apps (used for bulk operations)
   */
  setRemoteApps(apps: RemoteAppModel[]): void {
    this.data.remoteApps = apps;
    this.save();
  }

  /**
   * Add a remote app
   */
  addRemoteApp(app: RemoteAppModel): void {
    this.data.remoteApps.push(app);
    this.save();
  }

  /**
   * Update a remote app
   */
  updateRemoteApp(id: string, updates: Partial<RemoteAppModel>): boolean {
    const index = this.data.remoteApps.findIndex((a) => a.id === id);
    if (index === -1) return false;

    this.data.remoteApps[index] = {
      ...this.data.remoteApps[index],
      ...updates,
    };
    this.save();
    return true;
  }

  /**
   * Delete a remote app
   */
  deleteRemoteApp(id: string): boolean {
    const initialLength = this.data.remoteApps.length;
    this.data.remoteApps = this.data.remoteApps.filter((a) => a.id !== id);
    if (this.data.remoteApps.length !== initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  /**
   * Check database health
   */
  async checkHealth(): Promise<boolean> {
    try {
      // Try to read and parse the database file
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, "utf-8");
        JSON.parse(content);
      }
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
const db = new JsonDatabase();
export default db;
