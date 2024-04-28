"use server";

import { revalidatePath } from "next/cache";
import { ContainerData, OperationResult } from "@/types/types";
import QueriesService from "@/server/queries/queries.service";
import ContainerHelper from "@/helpers/container.helper";
import { logger } from "@/lib/logger";

export async function changeShellPasswordAction(
  shell: ContainerData,
  newPassword: string,
): Promise<OperationResult> {
  shell.password = newPassword;

  const { success, error } = await new ContainerHelper(shell).changePassword();

  if (success) {
    logger.info("Password changed!");
    await QueriesService.changeShellPassword(shell);
    revalidatePath("/", "layout");
    return { success: true };
  }

  logger.error(`Error changing password! Error: ${error}`);
  return { success: false };
}
