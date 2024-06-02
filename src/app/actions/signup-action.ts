"use server";

import { getConfig } from "@/config/config";
import { getSession } from "@/lib/helpers/session.helper";
import { action } from "@/lib/safe-action";
import QueriesService from "@/server/queries/queries.service";
import { genSalt, hash } from "bcrypt-ts";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export const signupAction = action(schema, async ({ username, password }) => {
  const user = {
    username: getConfig().username,
    password: getConfig().password,
  };

  const session = await getSession();
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  await QueriesService.addUser(username, hashedPassword);

  session.username = user.username;
  session.isLoggedIn = true;
  await session.save();

  redirect("/");
});
