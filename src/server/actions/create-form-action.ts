"use server";
import { spawnContainer } from "../utils/container-helpers";
import { db } from "../db/db";
import { getRandomPassword, getRandomPort } from "../utils/random-generator";

export async function create(data: any) {
  const name = data.name;
  const distro = data.distro;
  const port = getRandomPort();
  const password = getRandomPassword();
  const payload = {
    id: 1,
    distro: distro,
    name: name,
    port: port,
    password: password,
  };
  console.log(payload);
  const ok = await spawnContainer(payload);
  if (ok?.success) {
    console.log("Server ready!");
  } else {
    console.error(`Failed to bake server. Error ${ok?.error}`);
  }
}
