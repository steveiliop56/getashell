"use server";

import { revalidatePath } from "next/cache";
import { ContainerData, OperationResult } from "../../types/types";
import QueriesService from "@/server/queries/queries.service";
import ContainerService from "@/utils/container.service";
import { logger } from "@/utils/logger";

export async function changeShellPasswordActionAsync(
  shell: ContainerData,
  newPassword: string,
): Promise<OperationResult> {
  shell.password = newPassword;

  const { success, error } = await new ContainerService(
    shell,
  ).changePasswordAsync();

  if (success) {
    logger.info("Password changed!");
    await QueriesService.changeShellPasswordAsync(shell);
    revalidatePath("/", "layout");
    return { success: true };
  }

  logger.warn(`Error changing password! Error: ${error}`);
  return { success: false };
}
