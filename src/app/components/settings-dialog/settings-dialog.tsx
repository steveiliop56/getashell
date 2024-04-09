"use client";

import { removeShellActionAsync } from "../../actions/remove-action";
import { ContainerData } from "@/types/types";
import { GearIcon, Pencil1Icon } from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  Text,
  Code,
  TextField,
  IconButton,
} from "@radix-ui/themes";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { changeShellPasswordActionAsync } from "@/app/actions/change-password-action";

interface shellData {
  shell: ContainerData;
}

export const SettingsDialog: React.FC<shellData> = ({ shell }) => {
  const [hostname, setHostname] = useState("yourhost");
  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);
  const sshCommand = `ssh -o StrictHostKeyChecking=no -p ${shell.port} ${shell.distro}@${hostname}`;
  const [open, setOpen] = React.useState(false);
  const [passwdEdit, setPasswdEdit] = React.useState(false);

  const handleDelete = async () => {
    setOpen(false);
    toast.info(`Deleting ${shell.name}...`);
    const { success } = await removeShellActionAsync(shell.id);
    if (success) {
      toast.success("Shell deleted!");
    } else {
      toast.error(
        "Error in deleting shell, please check logs. Still removing from database...",
      );
    }
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswdEdit(false);
    setOpen(false);
    const newPassword = new FormData(e.currentTarget).get(
      "new-password",
    ) as string;
    const { success } = await changeShellPasswordActionAsync(
      shell,
      newPassword,
    );
    if (success) {
      toast.success("Password changed successfully!");
    } else {
      toast.error("Error in changing password! Please check logs.");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button
          onClick={() => setOpen(true)}
          className="m-1"
          color="gray"
          variant="soft"
        >
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
          {!passwdEdit ? (
            <Flex className="flex-row gap-1">
              <Text weight="medium">
                Password:{" "}
                <Code color="gray" variant="ghost">
                  {shell.password}
                </Code>
              </Text>
              <IconButton
                className="size-5"
                color="blue"
                variant="soft"
                onClick={() => setPasswdEdit(true)}
              >
                <Pencil1Icon></Pencil1Icon>
              </IconButton>
            </Flex>
          ) : (
            <Flex className="flex-row gap-1">
              <Text weight="medium">Password: </Text>
              <form onSubmit={(e) => handlePasswordSubmit(e)}>
                <Flex className="flex-row gap-1">
                  <TextField.Root
                    required
                    placeholder="New password..."
                    size="1"
                    name="new-password"
                  />
                  <Button type="submit" color="blue" variant="soft" size="1">
                    Save
                  </Button>
                  <Button
                    color="gray"
                    variant="soft"
                    size="1"
                    onClick={() => setPasswdEdit(false)}
                  >
                    Cancel
                  </Button>
                </Flex>
              </form>
            </Flex>
          )}
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
            color="orange"
            variant="soft"
          >
            Delete
          </Button>
          <Button onClick={() => setOpen(false)} color="blue" variant="soft">
            Close
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
