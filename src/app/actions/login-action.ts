"use server";

import { getConfig } from "@/config/config";
import { cookies } from "next/headers";

export async function loginAction(
  inputUsername: string,
  inputPassword: string,
) {
  const { username, password } = getConfig();

  cookies().set("loggedIn", "true");

  if (username == inputUsername && password == inputPassword) {
    return { success: true };
  }

  return { success: false };
}
