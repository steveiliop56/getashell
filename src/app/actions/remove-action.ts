"use server";

import QueriesService from "@/server/queries/queries.service";
import { OperationResult } from "@/types/types";
import ContainerService from "@/utils/container.service";
import { logger } from "@/utils/logger";
import { revalidatePath } from "next/cache";

export async function removeShellActionAsync(
  id: number,
): Promise<OperationResult> {
  const shell = await QueriesService.getShellFromIdAsync(id);
  if (!shell) {
    logger.info(
      `Shell with id ${id} does not exist, so we can safely return a success.`,
    );
    return { success: true };
  }
  const remove = await new ContainerService(shell).removeContainerAsync();

  if (remove.success) {
    logger.info("Container killed! Removing from db...");
    await QueriesService.deleteShellAsync(id);
    revalidatePath("/", "layout");
    return { success: true };
  }
  logger.warn(
    `Cannot remove container, still removing from db, error: ${remove.error}`,
  );
  await QueriesService.deleteShellAsync(id);
  revalidatePath("/", "layout");
  return { success: false };
}
