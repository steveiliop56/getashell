"use client";

import { Flex, Separator } from "@radix-ui/themes";
import { remove } from "../../../server/actions/remove-actions";
import { toast } from "react-toastify";
import { renderShell } from "../render-shell";
import { containerData } from "../../../server/types/types";
import { CreateForm } from "../create-form";
import { create } from "../../../server/actions/create-action";

type initialData = {
  initialData: containerData[];
};

export const ShellActions = (initialData: initialData) => {
  const handleDelete = async (shell: containerData) => {
    toast.info(`Deleting ${shell.name}...`);
    const { success } = await remove(shell.id);
    if (success) {
      toast.success("Shell deleted!");
    } else {
      toast.error("Error in deleting shell, please check logs.");
    }
  };

  const handleCreate = async (
    name: string,
    distro: string,
    extraArgs: string,
  ) => {
    const { success } = await create(name, distro, extraArgs);
    if (success) {
      toast.success("Shell successfully created!");
    } else {
      toast.error("Error in creating shell, please checks logs.");
    }
  };

  return (
    <Flex className="flex-col border-sky-500 border-2 border-dashed rounded-md p-5 justify-stretch items-stretch">
      <CreateForm handleCreate={handleCreate} />
      <Separator my="3" size="4" />
      <Flex className="flex-col">
        {initialData.initialData.map((shell: containerData) =>
          renderShell(shell, handleDelete),
        )}
      </Flex>
    </Flex>
  );
};
