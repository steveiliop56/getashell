"use server";
import QueriesService from "@/server/queries/queries.service";
import { ContainerData, OperationResult } from "@/types/types";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import ContainerHelper from "@/helpers/container.helper";

export async function stopShellAction(
  shell: ContainerData,
): Promise<OperationResult> {
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
