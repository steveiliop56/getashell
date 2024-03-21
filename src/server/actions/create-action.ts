"use server";

import { addShell, getShellIds, portAvailable } from "../queries/queries";
import { createContainer } from "../utils/container-helpers";
import { getRandomPassword, getRandomPort } from "../utils/random-generator";
import { revalidatePath } from "next/cache";

export async function create(name: string, distro: string, extraArgs: string) {
  let port = getRandomPort();
  while (!portAvailable(port)) {
    port = getRandomPort();
  }

  const password = getRandomPassword();

  const finalData = {
    id: (await getShellIds()) + 1,
    distro: distro,
    name: name,
    port: port,
    password: password,
    extraArgs: extraArgs,
  };

  const ok = await createContainer(finalData);

  if (ok?.success) {
    console.log("Server ready!");
    await addShell(finalData);
    revalidatePath("/", "layout");
  } else {
    console.error(`Failed to bake server. Error ${ok?.error}`);
  }
}
