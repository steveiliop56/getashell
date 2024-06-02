import { logger } from "@/lib/logger";
import { envSchema } from "@/schemas/environmentSchema";
import { EnvironmentData } from "@/types/types";
import dotenv from "dotenv";

export const getConfig = (): EnvironmentData => {
  logger.info("Loading .env file");
  dotenv.config({ path: ".env" });

  const result = envSchema.safeParse(process.env);
  if (result.success) {
    logger.info("Env file parsed!");
    return result.data;
  }

  logger.error(
    "Wrong env file...GOOD LUCK (nah i am joking returning dev values...)"
  );

  return {
    migrationDir: "migrations",
    dataDir: "data",
    ncHost: "127.0.0.1",
    secretKey: "verylongsupersecretkeythatnobodywillsee",
  };
};
