import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../../src/server/db/schema";
import fs from "fs";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

if (!fs.existsSync("data")) {
  fs.mkdirSync("data");
}

const sqlite = new Database(`data/sqlite.db`);

const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "migrations" });

export const clearDatabase = async () => {
  await db.delete(schema.shells);
  await db.delete(schema.users);
};

export const addUser = async () => {
  await db.insert(schema.users).values({
    username: "user",
    password: "$2b$10$Rv5HABdoJ0G/0oOwIXr/IuWdu0jMPeSmOiWxNXGHe8YUQcToR5Gn6",
  });
};
