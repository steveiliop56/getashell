"use server";

import { getSession } from "@/lib/helpers/session.helper";
import { action } from "@/lib/safe-action";
import { redirect } from "next/navigation";
import { z } from "zod";

export const logoutAction = action(z.void(), async () => {
  const session = await getSession();
  session.destroy();
  redirect("/login");
});
