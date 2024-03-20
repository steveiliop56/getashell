"use server";
import { addShell, getShellIds, portAvailable } from "../queries/queries";
import { containerData } from "../types/types";
import { spawnContainer } from "../utils/container-helpers";
import { getRandomPassword, getRandomPort } from "../utils/random-generator";

export async function create(data: containerData) {
  const name = data.name;
  const distro = data.distro;
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
  };
  await addShell(finalData);
  const ok = await spawnContainer(finalData);
  if (ok?.success) {
    console.log("Server ready!");
  } else {
    console.error(`Failed to bake server. Error ${ok?.error}`);
  }
}
