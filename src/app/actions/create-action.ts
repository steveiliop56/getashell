"use server";

import {
  addShell,
  checkIfShellExists,
  getShellIds,
  portAvailable,
} from "../../server/queries/queries";
import { containerHelpers } from "../../utils/container-helpers";
import { revalidatePath } from "next/cache";
import {
  createRandomPassowrd,
  createRandomPort,
} from "../../utils/random-generator";
import { availablePortChecker } from "../../utils/port-checker";

export async function create(name: string, distro: string, extraArgs: string) {
  console.log(
    `Creating shell with name ${name}, distro ${distro}, extra arguments ${extraArgs}...`,
  );

  if (await checkIfShellExists(name)) {
    return { success: false, shellExists: true };
  }

  let port: number;
  do {
    port = createRandomPort(); // FUTURE - Consider refactoring this into a `getAvailablePort` function which does all of this for us.
    console.log(`Attempting port ${port}`);
  } while (!(await availablePortChecker(port).success || !portAvailable(port));

  const data = {
    id: (await getShellIds()) + 1,
    distro: distro,
    name: name,
    port: port,
    password: createRandomPassowrd(),
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
