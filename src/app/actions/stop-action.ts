"use server";

import { changeShellRunningStatus } from "@/server/queries/queries";
import { containerData } from "@/types/types";
import { containerHelpers } from "@/utils/container-helpers";
import { revalidatePath } from "next/cache";

export const stop = async (shell: containerData) => {
  shell.running = "false";
  const { success, error } = await new containerHelpers(shell).stopContainer();

  if (success) {
    console.log("Shell stopped!");
    revalidatePath("/", "layout");
    await changeShellRunningStatus(shell);
    return { success: true };
  }

  console.error(`Failed to stop ${shell.name}! Error: ${error}`);
  return { success: false };
};
