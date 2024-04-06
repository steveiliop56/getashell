"use client";

import { ContainerData } from "@/types/types";
import { Card, Flex, Text, Button } from "@radix-ui/themes";
import { SettingsDialog } from "../settings-dialog";
import { toast } from "react-toastify";
import { stopShellActionAsync } from "../../actions/stop-action";
import { startShellActionAsync } from "../../actions/start-action";

export const renderShell = (shell: ContainerData) => {
  const handleStopStart = async () => {
    if (shell.running) {
      toast.info(`Stopping ${shell.name}...`);
      const { success } = await stopShellActionAsync(shell);
      if (success) {
        toast.success("Shell stopped!");
      } else {
        toast.error("Error in stopping shell! Please check logs!");
      }
    } else {
      toast.info(`Starting ${shell.name}...`);
      const { success } = await startShellActionAsync(shell);
      if (success) {
        toast.success("Shell starrted");
      } else {
        toast.error("Error in starrting shell! Please check logs!");
      }
    }
  };

  return (
    <Card key={shell.name}>
      <Flex className="flex-row justify-between p-1">
        <Flex className="items-center">
          <Text weight="medium">{shell.name}</Text>
        </Flex>
        <Flex className="flex-row gap-1 items-center">
          <SettingsDialog shell={shell} />
          {shell.running ? (
            <Button
              onClick={() => handleStopStart()}
              color="orange"
              variant="soft"
            >
              Stop
            </Button>
          ) : (
            <Button
              onClick={() => handleStopStart()}
              color="indigo"
              variant="soft"
            >
              Start
            </Button>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};
