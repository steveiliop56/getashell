"use client";

import { containerData } from "@/server/types/types";
import { Flex, Separator } from "@radix-ui/themes";
import { CreateShellForm } from "../create-shell-form";
import { renderShell } from "../render-shell";

interface shellDataType {
  shellData: containerData[];
}

export const ShellActions = (shellData: shellDataType) => {
  return (
    <Flex className="flex-col border-sky-500 border-2 border-dashed rounded-md p-5 justify-stretch items-stretch">
      <CreateShellForm />
      <Separator my="3" size="4" />
      <Flex className="flex-col gap-2">
        {shellData.shellData.map((shell: containerData) => renderShell(shell))}
      </Flex>
    </Flex>
  );
};
