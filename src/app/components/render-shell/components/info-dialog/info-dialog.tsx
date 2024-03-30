"use client";

import { containerData } from "@/server/types/types";
import { InfoCircledIcon, Pencil1Icon } from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  Text,
  Code,
  Popover,
  IconButton,
  TextArea,
} from "@radix-ui/themes";
import React from "react";

interface shellData {
  shell: containerData;
}

export const InfoDialog: React.FC<shellData> = ({ shell }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button className="m-1">
          <InfoCircledIcon />
          Info
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Shell info</Dialog.Title>
        <Dialog.Description>View your shell information</Dialog.Description>

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

        <Flex justify={"end"}>
          <Dialog.Close>
            <Button>Close</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const PasswordEdit: React.FC<shellData> = ({ shell }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isRequired, setIsRequired] = React.useState(true);
  return (
    <Flex className="flex-row gap-2">
      <Text weight="medium">
        Password:{" "}
        <Code color="gray" variant="ghost">
          {shell.password}
        </Code>
      </Text>

      <Popover.Root open={isOpen}>
        <Popover.Trigger>
          <IconButton onClick={() => setIsOpen(true)} className="size-5">
            <Pencil1Icon />
          </IconButton>
        </Popover.Trigger>

        <Popover.Content>
          <form onSubmit={() => setIsOpen(false)}>
            <Flex className="flex-col gap-2">
              <TextArea
                required={isRequired}
                placeholder="Type new password..."
              />
              <Flex className="flex-row gap-2 justify-end">
                <Button
                  color="gray"
                  variant="soft"
                  highContrast
                  onClick={() => {
                    setIsRequired(false);
                    setIsOpen(false);
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
