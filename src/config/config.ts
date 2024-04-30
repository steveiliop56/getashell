import { logger } from "@/lib/logger";
import { envSchema } from "@/schemas/environmentSchema";
import { EnvironmentData } from "@/types/types";
import dotenv from "dotenv";

export const getConfig = (): EnvironmentData => {
  logger.info("Loading .env file");
  dotenv.config({ path: ".env" });

  if (envSchema.safeParse(process.env).success) {
    logger.info("Env file parsed!");
    return {
      migrationDir: process.env.MIGRATION_DIR || "",
      dataDir: process.env.DATA_DIR || "",
      ncHost: process.env.NC_HOST || "",
      username: process.env.USERNAME || "",
      password: process.env.PASSWORD || "",
      secretKey: process.env.SECRET_KEY || "",
    };
  }

  logger.error(
    "Wrong env file...GOOD LUCK (nah i am joking returning dev values...)",
  );

  return {
    migrationDir: "migrations",
    dataDir: "data",
    ncHost: "127.0.0.1",
    username: "user",
    password: "password",
    secretKey: "verylongsupersecretkeythatnobodywillsee",
  };
};
