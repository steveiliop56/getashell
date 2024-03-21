"use client";

import { Flex, Separator } from "@radix-ui/themes";
import { remove } from "../../../server/actions/remove-actions";
import { toast } from "react-toastify";
import { renderShell } from "../render-shell";
import { containerData } from "../../../server/types/types";
import { CreateForm } from "../create-form";
import { create } from "../../../server/actions/create-action";

export const ShellActions = (initialData: any) => {
  const handleDelete = (id: number, name: string) => {
    toast.info(`Deleting ${name}...`);
    remove(id);
  };

  const handleCreate = (data: containerData) => {
    create(data);
  };

  return (
    <Flex className="flex-col border-sky-500 border-2 border-dashed rounded-md p-5">
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
