"use server";
import QueriesService from "@/server/queries/queries.service";
import { ContainerData, OperationResult } from "@/types/types";
import ContainerService from "@/utils/container.service";
import { revalidatePath } from "next/cache";

export async function stopShellAsync(
  shell: ContainerData,
): Promise<OperationResult> {
  shell.running = false;
  const { success, error } = await new ContainerService(
    shell,
  ).stopContainerAsync();

  if (success) {
    console.log("Shell stopped!");
    revalidatePath("/", "layout");
    await QueriesService.changeShellRunningStatusAsync(shell);
    return { success: true };
  }

  console.error(`Failed to stop ${shell.name}! Error: ${error}`);
  return { success: false };
}
