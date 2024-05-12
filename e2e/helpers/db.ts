import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../../src/server/db/schema";
import fs from "fs";

if (!fs.existsSync("data")) {
  fs.mkdirSync("data");
}

const sqlite = new Database(`data/sqlite.db`);

const db = drizzle(sqlite);

export const clearDatabase = async () => {
  await db.delete(schema.shells);
};
