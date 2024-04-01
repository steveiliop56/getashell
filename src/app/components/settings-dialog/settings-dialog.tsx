"use client";

import { remove } from "../../actions/remove-action";
import { containerData } from "@/types/types";
import { GearIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, Text, Code } from "@radix-ui/themes";
import React from "react";
import { toast } from "react-toastify";
import { PasswordEdit } from "./components/password-edit";

interface shellData {
  shell: containerData;
}

export const SettingsDialog: React.FC<shellData> = ({ shell }) => {
  const sshCommand = `ssh -o StrictHostKeyChecking=no -p ${shell.port} ${shell.distro}@yourhost`;
  const [open, setOpen] = React.useState(false);

  const handleDelete = async () => {
    setOpen(false);
    toast.info(`Deleting ${shell.name}...`);
    const { success } = await remove(shell.id);
    if (success) {
      toast.success("Shell deleted!");
    } else {
      toast.error(
        "Error in deleting shell, please check logs. Still removing from database...",
      );
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button onClick={() => setOpen(true)} className="m-1">
          <GearIcon />
          Settings
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Shell Settings</Dialog.Title>
        <Dialog.Description>
          View your shell information and edit settings
        </Dialog.Description>

        <Flex className="my-2 flex-col justify-start">
          <Text weight="medium">
            Name:{" "}
            <Code color="gray" variant="ghost">
              {shell.name}
            </Code>
          </Text>
          <Text weight="medium">
            Distro:{" "}
            <Code color="gray" variant="ghost">
              {shell.distro}
            </Code>
          </Text>
          <Text weight="medium">
            Username:{" "}
            <Code color="gray" variant="ghost">
              {shell.distro}
            </Code>
          </Text>
          <PasswordEdit shell={shell} />
          <Text weight="medium">
            Port:{" "}
            <Code color="gray" variant="ghost">
              {shell.port}
            </Code>
          </Text>
          {shell.extraArgs && (
            <Text weight="medium">
              Extra Arguments:{" "}
              <Code color="gray" variant="ghost">
                {shell.extraArgs}
              </Code>
            </Text>
          )}
        </Flex>

        <Flex>
          <Text weight="medium" id="command-copy">
            SSH Command:{" "}
            <Code color="gray" variant="ghost">
              {sshCommand}
            </Code>
          </Text>
        </Flex>

        <Flex className="justify-end gap-2">
          <Button
            title="When you click the button your shell is gone!"
            onClick={() => handleDelete()}
            color="red"
          >
            Delete
          </Button>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
