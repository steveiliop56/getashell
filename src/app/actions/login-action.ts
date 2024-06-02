"use server";

import { getSession } from "@/lib/helpers/session.helper";
import { action } from "@/lib/safe-action";
import AuthQueries from "@/server/queries/auth/auth.queries";
import { compare } from "bcrypt-ts";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export const loginAction = action(schema, async ({ username, password }) => {
  const session = await getSession();
  const authQueries = new AuthQueries();

  if (await authQueries.checkIfUserExists(username)) {
    if (
      await compare(password, (await authQueries.getUser(username)).password)
    ) {
      session.username = username;
      session.isLoggedIn = true;
      await session.save();
      redirect("/");
    } else {
      return { success: false };
    }
  } else {
    return { success: false };
  }
});
