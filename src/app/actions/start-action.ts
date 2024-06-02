"use server";

import { ContainerData, OperationResult } from "@/types/types";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import ContainerHelper from "@/lib/helpers/container.helper";
import { shellSchema } from "@/schemas/shellSchema";
import { z } from "zod";
import { action } from "@/lib/safe-action";
import ShellQueries from "@/server/queries/shell/shell.queries";

const schema = z.object({
  shell: shellSchema,
});

export const startShellAction = action(
  schema,
  async ({ shell }): Promise<OperationResult> => {
    shell.running = true;
    const { success, error } = await new ContainerHelper(
      shell
    ).startContainer();

    if (success) {
      const shellQueries = new ShellQueries();
      logger.info("Shell started!");
      revalidatePath("/", "layout");
      await shellQueries.changeShellRunningStatus(shell);
      return { success: true };
    }

    logger.error(`Failed to start ${shell.name}! Error: ${error}`);
    return { success: false };
  }
);
