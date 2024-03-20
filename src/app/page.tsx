"use server";

import { Flex, Heading, Separator } from "@radix-ui/themes";
import { ShellActions } from "./components/shell-actions";
import { getShells } from "../server/queries/queries";

export default async function home() {
  const shellData = await getShells();
  return (
    <>
      <Flex className="flex-col p-10 justify-center items-center text-center">
        <Heading className="p-10" size="9" as="h1">
          Get A Shell
        </Heading>
        <ShellActions initialData={shellData} />
      </Flex>
    </>
  );
}
