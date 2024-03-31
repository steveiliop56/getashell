"use server";

import { revalidatePath } from "next/cache";
import { containerData } from "../types/types";
import { changeShellPassword } from "../queries/queries";
import { changePassword } from "../utils/container-helpers";

export const change = async (shell: containerData, newPassword: string) => {
  shell.password = newPassword;

  const { success, error } = await changePassword(shell);

  if (success) {
    await changeShellPassword(shell);
    revalidatePath("/", "layout");
    return { success: true };
  }

  console.log(`Error changing password! Error: ${error}`);
  return { success: false };
};
