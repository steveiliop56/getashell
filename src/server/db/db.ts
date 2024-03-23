import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import * as fs from "fs";

if (fs.existsSync("sqlite.db")) {
  fs.mkdirSync("data/");
  fs.renameSync("sqlite.db", "data/sqlite.db");
}

const sqlite = new Database("data/sqlite.db");

export const db: BetterSQLite3Database<typeof schema> = drizzle(sqlite, {
  schema,
});
