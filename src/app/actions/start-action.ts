"use server";

import QueriesService from "@/server/queries/queries.service";
import { ContainerData, OperationResult } from "@/types/types";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import ContainerHelper from "@/lib/helpers/container.helper";
import { shellSchema } from "@/schemas/shellSchema";
import { z } from "zod";
import { action } from "@/lib/safe-action";

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
      logger.info("Shell started!");
      revalidatePath("/", "layout");
      await QueriesService.changeShellRunningStatus(shell);
      return { success: true };
    }

    logger.error(`Failed to start ${shell.name}! Error: ${error}`);
    return { success: false };
  }
);
