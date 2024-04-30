import { redirect } from "next/navigation";

export default async function Default() {
  redirect("/home");
}
