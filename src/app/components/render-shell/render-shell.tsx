"use client";

import { remove } from "@/server/actions/remove-action";
import { containerData } from "@/server/types/types";
import { Card, Flex, Text, Button } from "@radix-ui/themes";
import { toast } from "react-toastify";
import { InfoDialog } from "./components/info-dialog";

export const renderShell = (shell: containerData) => {
  const handleDelete = async (shell: containerData) => {
    toast.info(`Deleting ${shell.name}...`);
    const { success } = await remove(shell.id);
    if (success) {
      toast.success("Shell deleted!");
    } else {
      toast.error("Error in deleting shell, please check logs.");
    }
  };

  return (
    <Card key={shell.name}>
      <Flex className="flex-row justify-between p-1">
        <Flex className="items-center">
          <Text weight="medium">{shell.name}</Text>
        </Flex>
        <Flex className="flex-row gap-1 items-center">
          <InfoDialog shell={shell} />
          <Button
            onClick={() => handleDelete(shell)}
            color="orange"
            variant="soft"
          >
            Delete
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};
