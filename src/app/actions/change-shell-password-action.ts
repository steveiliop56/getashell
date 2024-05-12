"use server";

import { revalidatePath } from "next/cache";
import { ContainerData, OperationResult } from "@/types/types";
import QueriesService from "@/server/queries/queries.service";
import ContainerHelper from "@/helpers/container.helper";
import { logger } from "@/lib/logger";
import { action } from "@/lib/safe-action";
import { z } from "zod";
import { shellSchema } from "@/schemas/shellSchema";

const schema = z.object({
  shell: shellSchema,
  newPassword: z.string(),
});

export const changeShellPasswordAction = action(
  schema,
  async ({ shell, newPassword }): Promise<OperationResult> => {
    shell.password = newPassword;

    const { success, error } = await new ContainerHelper(
      shell,
    ).changePassword();

    if (success) {
      logger.info("Password changed!");
      await QueriesService.changeShellPassword(shell);
      revalidatePath("/home", "layout");
      return { success: true };
    }

    logger.error(`Error changing password! Error: ${error}`);
    return { success: false };
  },
);