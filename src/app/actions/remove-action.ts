"use server";

import QueriesService from "@/server/queries/queries.service";
import { OperationResult } from "@/types/types";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import ContainerHelper from "@/helpers/container.helper";

export async function removeShellAction(id: number): Promise<OperationResult> {
  const shell = await QueriesService.getShellFromId(id);
  if (!shell) {
    logger.info(
      `Shell with id ${id} does not exist, so we can safely return a success.`,
    );
    return { success: true };
  }
  const remove = await new ContainerHelper(shell).removeContainer();

  if (remove.success) {
    logger.info("Container killed! Removing from db...");
    await QueriesService.deleteShell(id);
    revalidatePath("/", "layout");
    return { success: true };
  }
  logger.warn(
    `Cannot remove container, still removing from db, error: ${remove.error}`,
  );
  await QueriesService.deleteShell(id);
  revalidatePath("/", "layout");
  return { success: false };
}
