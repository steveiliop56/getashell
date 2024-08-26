"use server";

import { getSession } from "@/lib/helpers/session.helper";
import { actionClient } from "@/lib/safe-action";
import AuthQueries from "@/server/queries/auth/auth.queries";
import { genSalt, hash } from "bcrypt";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export const signupAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { username, password } }) => {
    const authQueries = new AuthQueries();
    const session = await getSession();
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    await authQueries.addUser(username, hashedPassword);

    session.username = username;
    session.isLoggedIn = true;
    await session.save();

    redirect("/");
  });
