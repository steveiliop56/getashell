"use server";

import { Flex, Heading } from "@radix-ui/themes";
import { ShellActions } from "./components/shell-actions";
import QueriesService from "@/server/queries/queries.service";
import distroService from "@/utils/distro.service";

export default async function home() {
  const shellData = await QueriesService.getShellsAsync();
  const availableDistos = new distroService().getDistros();
  return (
    <>
      <Flex className="flex-col p-10 justify-center items-center text-center">
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
