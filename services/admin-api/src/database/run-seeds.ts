import { v4 as uuidv4 } from "uuid";
import db from "./db.js";
import type { RemoteAppModel } from "../types/remote-app.js";
import logger from "../utils/logger.js";

/**
 * Seed the database with initial data
 */
async function runSeeds(): Promise<void> {
  logger.info("Running database seeds...");

  const existingApps = db.getRemoteApps();

  if (existingApps.length > 0) {
    logger.info(
      `Database already has ${existingApps.length} apps, skipping seed`
    );
    return;
  }

  const now = new Date();

  const seedApps: RemoteAppModel[] = [
    {
      id: uuidv4(),
      name: "demo-app",
      title: "Demo Application",
      icon: "Target",
      url: "http://localhost:3001",
      scope: "demo-app",
      module: "./App",
      is_active: true,
      display_order: 1,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      name: "calendar-app",
      title: "Mystical Calendar",
      icon: "Calendar",
      url: "http://localhost:3002",
      scope: "calendarApp",
      module: "./App",
      is_active: true,
      display_order: 2,
      created_at: now,
      updated_at: now,
    },
  ];

  db.setRemoteApps(seedApps);

  logger.info(`Seeded ${seedApps.length} remote apps`);
  logger.info("Seeds completed successfully");
}

runSeeds().catch((error) => {
  logger.error("Seed failed", error);
  process.exit(1);
});
