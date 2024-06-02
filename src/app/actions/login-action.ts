"use server";

import { getConfig } from "@/config/config";
import { getSession } from "@/lib/helpers/session.helper";
import { action } from "@/lib/safe-action";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export const loginAction = action(schema, async ({ username, password }) => {
  const user = {
    username: getConfig().username,
    password: getConfig().password,
  };

  const session = await getSession();

  if (user.username == username && user.password == password) {
    session.username = user.username;
    session.isLoggedIn = true;
    await session.save();
    redirect("/");
  }

  return { success: false };
});
