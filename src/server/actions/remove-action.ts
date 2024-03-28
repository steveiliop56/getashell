"use server";

import { getShellFromId, deleteShell } from "../queries/queries";
import { removeContainer } from "../utils/container-helpers";
import { revalidatePath } from "next/cache";

export async function remove(id: number) {
  const shell = await getShellFromId(id);
  const remove = await removeContainer(shell);

  if (remove?.success) {
    console.log("Container killed! Removing from db...");
    await deleteShell(id);
    revalidatePath("/", "layout");
    return { success: true };
  }
  console.error(
    `Cannot remove container, still removing from db, error: ${remove?.error}`,
  );
  await deleteShell(id);
  return { success: false };
}
