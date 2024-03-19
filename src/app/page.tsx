"use client";

import { Flex, Heading, Separator } from "@radix-ui/themes";
import { CreateForm } from "./components/create-form";

export default function home() {
  return (
    <>
      <Flex className="flex-col p-10 justify-center items-center">
        <Heading className="p-10" size="9" as="h1">
          Get A Shell
        </Heading>
        <Flex className="flex-col border-sky-500 border-2 border-dashed rounded-md justify-center items-center p-5">
          <CreateForm></CreateForm>
          <Separator my="3" size="4" />
        </Flex>
      </Flex>
    </>
  );
}
