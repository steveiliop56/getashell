"use client";

import { ContainerData, SupportedDistros } from "@/types/types";
import { Flex, Separator } from "@radix-ui/themes";
import { CreateShellForm } from "../create-shell-form";
import { renderShell } from "../render-shell";
import React from "react";

interface initialData {
  shellData: ContainerData[];
  availableDistros: SupportedDistros;
}

export const ShellActions: React.FC<initialData> = ({
  shellData,
  availableDistros,
}) => {
  const shells = shellData;
  return (
    <Flex className="flex-col border-sky-500 border-2 border-dashed rounded-md p-5 justify-stretch items-stretch">
      <CreateShellForm availableDistros={availableDistros} />
      <Separator my="3" size="4" />
      <Flex className="flex-col gap-2">
        {shells.map((shell: ContainerData) => renderShell(shell))}
      </Flex>
    </Flex>
  );
};
