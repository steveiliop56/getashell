import { Flex, Card, Text, Button, Dialog } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { containerData } from "../../../server/types/types";
import React from "react";

export const renderShell = (shell: containerData, handleDelete: Function) => {
  return (
    <Card key={shell.id} className="m-2">
      <div className="flex flex-row justify-between">
        <Flex className="items-center m-1">
          <Text>{shell.name}</Text>
        </Flex>
        <Flex>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button className="m-1">
                <InfoCircledIcon />
                Info
              </Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Info</Dialog.Title>
              <Dialog.Description size="2" mb="4">
                View your {shell.name} credentials.
              </Dialog.Description>
              <Flex className="justify-items-start flex-col">
                <Text weight={"medium"}>
                  Distro: <Text weight={"regular"}>{shell.distro}</Text>
                </Text>
                <Text weight={"medium"}>
                  Username: <Text weight={"regular"}>{shell.distro}</Text>
                </Text>
                <Text weight={"medium"}>
                  Password: <Text weight={"regular"}>{shell.password}</Text>
                </Text>
                <Text weight={"medium"}>
                  Port: <Text weight={"regular"}>{shell.port}</Text>
                </Text>
                <Text weight={"medium"}>
                  Extra Arguments:{" "}
                  <Text weight={"regular"}>{shell.extraArgs}</Text>
                </Text>
              </Flex>
              <Flex justify={"end"}>
                <Dialog.Close>
                  <Button>Close</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
          <Button
            onClick={() => handleDelete(shell)}
            className="m-1"
            color="orange"
            variant="soft"
          >
            Delete
          </Button>
        </Flex>
      </div>
    </Card>
  );
};
