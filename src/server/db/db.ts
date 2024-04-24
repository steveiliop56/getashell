import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import * as fs from "fs";
import { getConfig } from "../../config/config";

const { dataDir, migrationDir } = getConfig();

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const sqlite = new Database(`${dataDir}/sqlite.db`);

migrate(drizzle(sqlite), { migrationsFolder: migrationDir });

export const db = drizzle(sqlite);
