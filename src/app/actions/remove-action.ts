"use server";

import { getShellFromId, deleteShell } from "../../server/queries/queries";
import { containerHelpers } from "../../utils/container-helpers";
import { revalidatePath } from "next/cache";

export async function remove(id: number) {
  const shell = await getShellFromId(id);
  const remove = await new containerHelpers(shell).removeContainer();

  if (remove.success) {
    console.log("Container killed! Removing from db...");
    await deleteShell(id);
    revalidatePath("/", "layout");
    return { success: true };
  }
  console.error(
    `Cannot remove container, still removing from db, error: ${remove.error}`,
  );
  await deleteShell(id);
  revalidatePath("/", "layout");
  return { success: false };
}
