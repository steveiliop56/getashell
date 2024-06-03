"use server";

import { getSession } from "@/lib/helpers/session.helper";
import { action } from "@/lib/safe-action";
import AuthQueries from "@/server/queries/auth/auth.queries";
import { compare } from "bcrypt";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export const loginAction = action(schema, async ({ username, password }) => {
  const session = await getSession();
  const authQueries = new AuthQueries();
  const user = await authQueries.getUser(username);

  if (user === undefined) return { success: false };

  if (!(await compare(password, user.password))) return { success: false };

  session.username = username;
  session.isLoggedIn = true;

  await session.save();
  redirect("/");
});
