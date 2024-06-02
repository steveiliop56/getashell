import z from "zod";

export const envSchema = z
  .object({
    MIGRATION_DIR: z.string(),
    DATA_DIR: z.string(),
    NC_HOST: z.string(),
    SECRET_KEY: z.string(),
  })
  .transform((data) => {
    return {
      migrationDir: data.MIGRATION_DIR,
      dataDir: data.DATA_DIR,
      ncHost: data.NC_HOST,
      secretKey: data.SECRET_KEY,
    };
  });
