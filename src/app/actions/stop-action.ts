"use server";
import QueriesService from "@/server/queries/queries.service";
import { OperationResult } from "@/types/types";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import ContainerHelper from "@/lib/helpers/container.helper";
import { z } from "zod";
import { action } from "@/lib/safe-action";
import { shellSchema } from "@/schemas/shellSchema";

const schema = z.object({
  shell: shellSchema,
});

export const stopShellAction = action(
  schema,
  async ({ shell }): Promise<OperationResult> => {
    shell.running = false;
    const { success, error } = await new ContainerHelper(shell).stopContainer();

    if (success) {
      logger.info("Shell stopped!");
      revalidatePath("/", "layout");
      await QueriesService.changeShellRunningStatus(shell);
      return { success: true };
    }

    logger.error(`Failed to stop ${shell.name}! Error: ${error}`);
    return { success: false };
  }
);
