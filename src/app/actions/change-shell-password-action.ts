"use server";

import { revalidatePath } from "next/cache";
import { OperationResult } from "@/types/types";
import ContainerHelper from "@/lib/helpers/container.helper";
import { logger } from "@/lib/logger";
import { action } from "@/lib/safe-action";
import { z } from "zod";
import { shellSchema } from "@/schemas/shellSchema";
import ShellService from "@/server/services/shell/shell.service";

const schema = z.object({
  shell: shellSchema,
  newPassword: z.string(),
});

export const changeShellPasswordAction = action(
  schema,
  async ({ shell, newPassword }): Promise<OperationResult> => {
    shell.password = newPassword;

    const { success, error } = await new ContainerHelper(
      shell
    ).changePassword();

    if (success) {
      const shellService = new ShellService();
      logger.info("Password changed!");
      await shellService.changeShellPassword(shell);
      revalidatePath("/", "layout");
      return { success: true };
    }

    logger.error(`Error changing password! Error: ${error}`);
    return { success: false };
  }
);
