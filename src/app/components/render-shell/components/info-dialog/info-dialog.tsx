"use client";

import { containerData } from "@/server/types/types";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, Text, Code } from "@radix-ui/themes";
import React from "react";

interface props {
  shell: containerData;
}

export const InfoDialog: React.FC<props> = ({ shell }) => {
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
              {shell.name}
            </Code>
          </Text>
          <Text weight="medium">
            Password:{" "}
            <Code color="gray" variant="ghost">
              {shell.password}
            </Code>
          </Text>
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
