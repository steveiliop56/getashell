"use server";

import { OperationResult } from "@/types/types";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import ContainerHelper from "@/lib/helpers/container.helper";
import { z } from "zod";
import { action } from "@/lib/safe-action";
import ShellQueries from "@/server/queries/shell/shell.queries";

const schema = z.object({
  id: z.number(),
});

export const removeShellAction = action(
  schema,
  async ({ id }): Promise<OperationResult> => {
    const shellQueries = new ShellQueries();

    const shell = await shellQueries.getShellFromId(id);

    if (!shell) {
      logger.info(
        `Shell with id ${id} does not exist, so we can safely return a success.`
      );
      return { success: true };
    }
    const remove = await new ContainerHelper(shell).removeContainer();

    if (remove.success) {
      logger.info("Container killed! Removing from db...");
      await shellQueries.deleteShell(id);
      revalidatePath("/", "layout");
      return { success: true };
    }
    logger.warn(
      `Cannot remove container, still removing from db, error: ${remove.error}`
    );
    await shellQueries.deleteShell(id);
    revalidatePath("/", "layout");
    return { success: false };
  }
);
