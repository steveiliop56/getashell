"use server";

import { OperationResult } from "@/types/types";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import ContainerHelper from "@/lib/helpers/container.helper";
import { z } from "zod";
import { action } from "@/lib/safe-action";
import { shellSchema } from "@/schemas/shellSchema";
import ShellService from "@/server/services/shell/shell.service";

const schema = z.object({
  shell: shellSchema,
});

export const stopShellAction = action(
  schema,
  async ({ shell }): Promise<OperationResult> => {
    shell.running = false;
    const { success, error } = await new ContainerHelper(shell).stopContainer();

    if (success) {
      const shellService = new ShellService();
      logger.info("Shell stopped!");
      revalidatePath("/", "layout");
      await shellService.changeShellRunningStatus(shell);
      return { success: true };
    }

    logger.error(`Failed to stop ${shell.name}! Error: ${error}`);
    return { success: false };
  }
);
