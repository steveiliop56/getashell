"use server";

import {
  addShell,
  checkIfShellExists,
  getShellIds,
  portAvailable,
} from "../queries/queries";
import { createContainer } from "../utils/container-helpers";
import { revalidatePath } from "next/cache";
import {
  createRandomPassowrd,
  createRandomPort,
} from "../utils/random-generator";
import { availablePortChecker } from "../utils/port-checker";

export async function create(name: string, distro: string, extraArgs: string) {
  console.log(
    `Creating shell with name ${name}, distro ${distro}, extra arguments ${extraArgs}...`,
  );

  if (await checkIfShellExists(name)) {
    return { success: false, shellExists: true };
  }

  let port = createRandomPort();
  console.log(port);

  while (!(await availablePortChecker(port)).success || !portAvailable(port)) {
    port = createRandomPort();
  }

  const data = {
    id: (await getShellIds()) + 1,
    distro: distro,
    name: name,
    port: port,
    password: createRandomPassowrd(),
    extraArgs: extraArgs,
  };

  const ok = await createContainer(data);

  if (ok?.success) {
    console.log("Server ready!");
    await addShell(data);
    revalidatePath("/", "layout");
    return { success: true };
  }
  console.error(`Failed to bake server: ${ok?.error}`);
  return { success: false };
}
