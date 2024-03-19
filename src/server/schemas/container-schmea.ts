import { z } from "zod";

export const containerSchema = z.object({
  id: z.number(),
  distro: z.string(),
  name: z.string(),
  port: z.number(),
  password: z.string(),
});
