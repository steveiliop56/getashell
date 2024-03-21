"use server";

import { getShellFromId, deleteShell } from "../queries/queries";
import { killContainer } from "../utils/container-helpers";
import { revalidatePath } from "next/cache";

export async function remove(id: number) {
  const shell = await getShellFromId(id);
  const kill = await killContainer(shell.name, shell.distro);
  if (kill.success) {
    console.log("Container killed! Removing from db...");
  } else {
    console.error(
      `Cannot remove container error: ${kill.error}. Still removing from db...`,
    );
  }
  await deleteShell(id);
  revalidatePath("/", "layout");
}
