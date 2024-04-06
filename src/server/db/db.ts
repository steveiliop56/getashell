import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import * as fs from "fs";
import { migrateDb } from "./migrator";
import { getConfig } from "../../config/config";
import { logger } from "@/utils/logger";

const { databasePath, dataDir } = getConfig();

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

logger.info("Running database migrations...");

migrateDb();

logger.info("Migrations finished! Connecting to databse...");

const sqlite = new Database(databasePath);

export const db: BetterSQLite3Database<typeof schema> = drizzle(sqlite, {
  schema,
});

logger.info("Connected to database!");
