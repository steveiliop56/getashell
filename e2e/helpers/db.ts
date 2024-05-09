import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../../src/server/db/schema";

const sqlite = new Database(`data/sqlite.db`);

export const db = drizzle(sqlite);

export const clearDatabase = async () => {
  await db.delete(schema.shells);
};
