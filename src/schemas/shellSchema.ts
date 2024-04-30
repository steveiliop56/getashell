import { z } from "zod";

export const shellSchema = z.object({
  id: z.number(),
  distro: z.string(),
  name: z.string(),
  port: z.number(),
  password: z.string(),
  extraArgs: z.string().nullable(),
  running: z.boolean().nullable(),
});
