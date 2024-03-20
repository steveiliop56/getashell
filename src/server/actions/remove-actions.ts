"use server";

import { getShellFromId, deleteShell } from "../queries/queries";
import { killContainer } from "../utils/container-helpers";

export async function remove(id: number) {
  const shell = await getShellFromId(id);
  const kill = await killContainer(shell.name, id);
  if (kill.success) {
    console.log("Container killed! Removing from db...");
  } else {
    console.error(
      `Cannot remove container error: ${kill.error}. Still removing from db...`,
    );
  }
  const db_remove = await deleteShell(id);
  console.debug(db_remove);
}
