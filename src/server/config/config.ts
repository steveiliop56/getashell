const env = process.env.NODE_ENV;

export const getConfig = () => {
  let migrationDir = "";
  let dataDir = "";
  let databasePath = "";
  let ncHost = "";

  if (env == "development") {
    migrationDir = "migrations";
    dataDir = "data";
    databasePath = "data/sqlite.db";
    ncHost = "127.0.0.1";
  } else if (env == "production") {
    migrationDir = "/app/migrations";
    dataDir = "/app/data";
    databasePath = "/app/data/sqlite.db";
    ncHost = "host.docker.internal";
  }

  return { migrationDir, dataDir, databasePath, ncHost };
};
