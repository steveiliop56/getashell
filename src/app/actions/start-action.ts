"use server";

import QueriesService from "@/server/queries/queries.service";
import { ContainerData, OperationResult } from "@/types/types";
import ContainerService from "@/utils/container.service";
import { logger } from "@/utils/logger";
import { revalidatePath } from "next/cache";

export async function startShellActionAsync(
  shell: ContainerData,
): Promise<OperationResult> {
  shell.running = true;
  const { success, error } = await new ContainerService(
    shell,
  ).startContainerAsync();

  if (success) {
    logger.info("Shell started!");
    revalidatePath("/", "layout");
    await QueriesService.changeShellRunningStatusAsync(shell);
    return { success: true };
  }

  logger.error(`Failed to start ${shell.name}! Error: ${error}`);
  return { success: false };
}
