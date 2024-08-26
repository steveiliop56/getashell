"use server";

import { OperationResult } from "@/types/types";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import ContainerHelper from "@/lib/helpers/container.helper";
import { z } from "zod";
import { shellSchema } from "@/schemas/shellSchema";
import ShellQueries from "@/server/queries/shell/shell.queries";
import { actionClient } from "@/lib/safe-action";

const schema = z.object({
  shell: shellSchema,
});

export const stopShellAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { shell } }): Promise<OperationResult> => {
    shell.running = false;
    const { success, error } = await new ContainerHelper(shell).stopContainer();

    if (success) {
      const shellQueries = new ShellQueries();
      logger.info("Shell stopped!");
      revalidatePath("/", "layout");
      await shellQueries.changeShellRunningStatus(shell);
      return { success: true };
    }

    logger.error(`Failed to stop ${shell.name}! Error: ${error}`);
    return { success: false };
  });
