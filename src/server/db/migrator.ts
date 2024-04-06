import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { getConfig } from "../../config/config";

export const migrateDb = () => {
  const { dataDir, migrationDir } = getConfig();

  const betterSqlite = new Database(`${dataDir}/sqlite.db`);
  const db = drizzle(betterSqlite);

  migrate(db, { migrationsFolder: migrationDir });

  betterSqlite.close();
};
