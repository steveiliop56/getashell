"use server";

import { Flex, Heading } from "@radix-ui/themes";
import { ShellActions } from "./components/shell-actions";
import distroHelper from "@/lib/helpers/distro.helper";
import { redirect } from "next/navigation";
import { LogoutButton } from "./components/logout-button";
import { getSession } from "@/lib/helpers/session.helper";
import ShellQueries from "@/server/queries/shell/shell.queries";

export default async function Home() {
  const session = await getSession();
  const shellQueries = new ShellQueries();

  if (!session.isLoggedIn) redirect("/login");

  const shellData = await shellQueries.getShells();
  const availableDistos = new distroHelper().getDistros();

  return (
    <>
      <Flex className="flex-col p-10 justify-center items-center text-center">
        <LogoutButton></LogoutButton>
        <Heading
          className="p-10 bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text"
          size="9"
          as="h1"
        >
          Get A Shell
        </Heading>
        <ShellActions
          shellData={shellData}
          availableDistros={availableDistos}
        />
      </Flex>
    </>
  );
}
