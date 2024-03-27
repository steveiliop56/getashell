import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import * as fs from "fs";
import { migrateDb } from "./migrator";

if (!fs.existsSync("/app/data")) {
  fs.mkdirSync("/app/data");
}

console.log("Running database migrations...");

migrateDb();

console.log("Migrations finished! Connecting to databse...");

const sqlite = new Database("/app/data/sqlite.db");

export const db: BetterSQLite3Database<typeof schema> = drizzle(sqlite, {
  schema,
});

console.log("Connected to database!");
