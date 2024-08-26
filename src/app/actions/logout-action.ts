"use server";

import { getSession } from "@/lib/helpers/session.helper";
import { actionClient } from "@/lib/safe-action";
import { redirect } from "next/navigation";
import { z } from "zod";

export const logoutAction = actionClient.schema(z.void()).action(async () => {
  const session = await getSession();
  session.destroy();
  redirect("/login");
});
