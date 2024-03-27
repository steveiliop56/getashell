import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";

export const migrateDb = () => {
  const betterSqlite = new Database("/app/data/sqlite.db");
  const db = drizzle(betterSqlite);

  migrate(db, { migrationsFolder: "/app/migrations" });

  betterSqlite.close();
};
