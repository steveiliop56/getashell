import z from "zod";

export const distoSchema = z.object({
  distro: z.object({
    name: z.string(),
    supported_architectures: z.string().array(),
  }),
});
