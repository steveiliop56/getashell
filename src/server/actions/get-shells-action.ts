"use server";

import { getShells } from "../queries/queries";

export async function get() {
  const shellData: object = await getShells();
  return shellData;
}
