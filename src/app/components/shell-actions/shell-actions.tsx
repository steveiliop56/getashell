"use client";

import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Flex, Separator } from "@radix-ui/themes";
import { remove } from "../../../server/actions/remove-actions";
import { toast } from "react-toastify";
import { renderShell } from "../render-shell";
import { containerData } from "../../../server/types/types";
import { CreateForm } from "../create-form";
import { create } from "../../../server/actions/create-action";

const queryClient = new QueryClient();

export const ShellActions = (initialData: any) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ShellActualActions initialData={initialData} />
    </QueryClientProvider>
  );
};

async function getShellData() {
  const res = await fetch("/api/shells");
  if (!res.ok) {
    throw new Error("Error getting shell data!");
  }
  const data = await res.json();
  return data;
}

const ShellActualActions = (initialData: any) => {
  const handleDelete = (id: number, name: string) => {
    remove(id);
    toast.info(`Deleting ${name}...`);
  };

  const handleCreate = (data: containerData) => {
    create(data);
  };

  const { error, data } = useQuery("data", getShellData, {
    initialData,
    refetchInterval: 5000,
  });

  if (error) {
    console.log(error.message);
    return (
      <Flex className="flex-col border-sky-500 border-2 border-dashed rounded-md p-5">
        <CreateForm handleCreate={handleCreate} />
        <Separator my="3" size="4" />
        <h2>Error. Please check the browser console.</h2>
      </Flex>
    );
  }

  if (data.data) {
    return (
      <Flex className="flex-col border-sky-500 border-2 border-dashed rounded-md p-5">
        <CreateForm handleCreate={handleCreate} />
        <Separator my="3" size="4" />
        <Flex className="flex-col">
          {data.data.map((shell: containerData) =>
            renderShell(shell, handleDelete),
          )}
        </Flex>
      </Flex>
    );
  } else {
    return (
      <Flex className="flex-col border-sky-500 border-2 border-dashed rounded-md p-5">
        <CreateForm handleCreate={handleCreate} />
        <Separator my="3" size="4" />
      </Flex>
    );
  }
};
