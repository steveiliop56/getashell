"use server";

import { Flex, Heading } from "@radix-ui/themes";
import { ShellActions } from "./components/shell-actions";
import QueriesService from "@/server/queries/queries.service";

export default async function home() {
  const shellData = await QueriesService.getShellsAsync();
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
        <ShellActions shellData={shellData} />
      </Flex>
    </>
  );
}
