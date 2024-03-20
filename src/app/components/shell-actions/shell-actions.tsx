"use client";

import { Flex, Separator } from "@radix-ui/themes";
import { useState } from "react";
import { remove } from "../../../server/actions/remove-actions";
import { toast } from "react-toastify";
import { get } from "../../../server/actions/get-shells-action";
import { renderShell } from "../render-shell";
import { containerData } from "../../../server/types/types";
import { CreateForm } from "../create-form";
import { create } from "../../../server/actions/create-action";

export const ShellActions = (initialData: any) => {
  const [shells, setShells] = useState(initialData.initialData);

  const handleDelete = (id: number, name: string) => {
    remove(id);
    toast.info(`Deleting ${name}...`);
    get().then(setShells);
  };

  const handleCreate = (data: containerData) => {
    create(data);
    get().then(setShells);
  };

  return (
    <Flex className="flex-col border-sky-500 border-2 border-dashed rounded-md p-5">
      <CreateForm handleCreate={handleCreate} />
      <Separator my="3" size="4" />
      <Flex className="flex-col">
        {shells.map((shell: containerData) => renderShell(shell, handleDelete))}
      </Flex>
    </Flex>
  );
};
