"use server";

import QueriesService from "@/server/queries/queries.service";
import { ContainerData, OperationResult } from "@/types/types";
import ContainerService from "@/utils/container.service";
import { revalidatePath } from "next/cache";

export async function startShellAsync(shell: ContainerData): Promise<OperationResult> {
  shell.running = true;
  const { success, error } = await new ContainerService(shell).startContainerAsync();

  if (success) {
    console.log("Shell started!");
    revalidatePath("/", "layout");
    await QueriesService.changeShellRunningStatusAsync(shell);
    return { success: true };
  }

  console.error(`Failed to start ${shell.name}! Error: ${error}`);
  return { success: false };
};
