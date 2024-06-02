"use server";

import { getConfig } from "@/config/config";
import { getSession } from "@/lib/helpers/session.helper";
import { action } from "@/lib/safe-action";
import QueriesService from "@/server/queries/queries.service";
import { compare } from "bcrypt-ts";
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

  if (await QueriesService.checkIfUserExists(username)) {
    if (
      await compare(password, await QueriesService.getUserPassword(username))
    ) {
      session.username = user.username;
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
