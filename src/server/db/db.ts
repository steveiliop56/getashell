import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import * as fs from "fs";

if (fs.existsSync("sqlite.db")) {
  console.log("DB not in data directory! Moving...");
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }
  fs.renameSync("sqlite.db", "data/sqlite.db");
} else if (!fs.existsSync("data/sqlite.db") && !fs.existsSync("sqlite.db")) {
  console.log("Couldn't find DB copying from assets...");
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }
  fs.copyFileSync("assets/sqlite.db", "data/sqlite.db");
}

const sqlite = new Database("data/sqlite.db");

export const db: BetterSQLite3Database<typeof schema> = drizzle(sqlite, {
  schema,
});
