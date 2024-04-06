"use server";
import QueriesService from "@/server/queries/queries.service";
import { ContainerData, OperationResult } from "@/types/types";
import ContainerService from "@/utils/container.service";
import { logger } from "@/utils/logger";
import { revalidatePath } from "next/cache";

export async function stopShellActionAsync(
  shell: ContainerData,
): Promise<OperationResult> {
  shell.running = false;
  const { success, error } = await new ContainerService(
    shell,
  ).stopContainerAsync();

  if (success) {
    logger.info("Shell stopped!");
    revalidatePath("/", "layout");
    await QueriesService.changeShellRunningStatusAsync(shell);
    return { success: true };
  }

  logger.error(`Failed to stop ${shell.name}! Error: ${error}`);
  return { success: false };
}
