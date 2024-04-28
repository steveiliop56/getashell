"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function logoutAction() {
  cookies().delete("loggedIn");
  redirect("/login");
}
