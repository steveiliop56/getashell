"use server";

import { revalidatePath } from "next/cache";
import { containerData } from "../../types/types";
import { changeShellPassword } from "../../server/queries/queries";
import { containerHelpers } from "../../utils/container-helpers";

export const change = async (shell: containerData, newPassword: string) => {
  shell.password = newPassword;

  const { success, error } = await new containerHelpers(shell).changePassword();

  if (success) {
    console.log("Password changed!");
    await changeShellPassword(shell);
    revalidatePath("/", "layout");
    return { success: true };
  }

  console.log(`Error changing password! Error: ${error}`);
  return { success: false };
};
