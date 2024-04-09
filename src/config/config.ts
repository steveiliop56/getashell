import { logger } from "@/lib/logger";
import { envSchema } from "@/schemas/environmentSchema";
import dotenv from "dotenv";

export const getConfig = () => {
  if (process.env.NODE_ENV == "development") {
    logger.info("Detected developemt environment! Using .env.dev");
    dotenv.config({ path: ".env.dev" });
  } else {
    logger.info("Using production .env file!");
    dotenv.config({ path: ".env.prod" });
  }

  if (envSchema.safeParse(process.env).success) {
    logger.info("Env file parsed!");
    return {
      migrationDir: process.env.MIGRATION_DIR || "",
      dataDir: process.env.DATA_DIR || "",
      ncHost: process.env.NC_HOST || "",
    };
  }

  logger.error(
    "Wrong env file...GOOD LUCK (nah i am joking returning dev values...)",
  );
  return {
    migrationDir: "migrations",
    dataDir: "data",
    ncHost: "127.0.0.1",
  };
};
