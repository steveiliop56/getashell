import z from "zod";

export const envSchema = z.object({
  MIGRATION_DIR: z.string(),
  DATA_DIR: z.string(),
  NC_HOST: z.string(),
  USERNAME: z.string(),
  PASSWORD: z.string(),
});
