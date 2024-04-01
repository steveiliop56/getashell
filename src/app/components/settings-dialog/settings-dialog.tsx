"use client";

import { remove } from "../../actions/remove-action";
import { containerData } from "@/types/types";
import { GearIcon, Pencil1Icon } from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  Text,
  Code,
  IconButton,
  Popover,
  TextArea,
} from "@radix-ui/themes";
import React, { FormEvent } from "react";
import { toast } from "react-toastify";
import { change } from "@/app/actions/change-password-action";

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

const PasswordEdit: React.FC<shellData> = ({ shell }) => {
  const [mainOpen, setMainOpen] = React.useState(false);
  const [isRequired, setIsRequired] = React.useState(true);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMainOpen(false);
    const newPassword = new FormData(e.currentTarget).get(
      "new-password",
    ) as string;
    const { success } = await change(shell, newPassword);
    if (success) {
      toast.success("Password changed successfully!");
    } else {
      toast.error("Error in changing password! Please check logs.");
    }
  };

  return (
    <Flex className="flex-row gap-2">
      <Text weight="medium">
        Password:{" "}
        <Code color="gray" variant="ghost">
          {shell.password}
        </Code>
      </Text>

      <Popover.Root open={mainOpen}>
        <Popover.Trigger>
          <IconButton onClick={() => setMainOpen(true)} className="size-5">
            <Pencil1Icon />
          </IconButton>
        </Popover.Trigger>

        <Popover.Content>
          <form onSubmit={(e) => handleSubmit(e)}>
            <Flex className="flex-col gap-2">
              <TextArea
                required={isRequired}
                name="new-password"
                placeholder="Type new password..."
              />
              <Flex className="flex-row gap-2 justify-end">
                <Button
                  color="gray"
                  variant="soft"
                  type="button"
                  highContrast
                  onClick={() => {
                    setIsRequired(false);
                    setMainOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </Flex>
            </Flex>
          </form>
        </Popover.Content>
      </Popover.Root>
    </Flex>
  );
};
