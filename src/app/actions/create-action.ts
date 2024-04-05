"use server";

import {
  addShell,
  checkIfShellExists,
  getShellIds,
} from "../../server/queries/queries";
import { containerHelpers } from "../../utils/container-helpers";
import { revalidatePath } from "next/cache";
import {
  createRandomPassword
} from "../../utils/random-generator";
import { getAvailablePort } from "../../utils/port-checker";

export async function create(name: string, distro: string, extraArgs: string) {
  console.log(
    `Creating shell with name ${name}, distro ${distro}, extra arguments ${extraArgs}...`,
  );

  if (await checkIfShellExists(name)) {
    return { success: false, shellExists: true };
  }

  let port = await getAvailablePort();

  const data = {
    id: (await getShellIds()) + 1,
    distro: distro,
    name: name,
    port: port,
    password: createRandomPassword(),
    extraArgs: extraArgs,
    running: true,
  };

  const { success, error } = await new containerHelpers(data).createContainer();

  if (success) {
    console.log("Server ready!");
    await addShell(data);
    revalidatePath("/", "layout");
    return { success: true };
  }
  console.error(`Failed to bake server: ${error}`);
  return { success: false };
}
