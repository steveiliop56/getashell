"use server";

import { changeShellRunningStatus } from "@/server/queries/queries";
import { containerData } from "@/types/types";
import { containerHelpers } from "@/utils/container-helpers";
import { revalidatePath } from "next/cache";

export const start = async (shell: containerData) => {
  shell.running = "true";
  const { success, error } = await new containerHelpers(shell).startContainer();

  if (success) {
    console.log("Shell started!");
    revalidatePath("/", "layout");
    await changeShellRunningStatus(shell);
    return { success: true };
  }

  console.error(`Failed to start ${shell.name}! Error: ${error}`);
  return { success: false };
};
