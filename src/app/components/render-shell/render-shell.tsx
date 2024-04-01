"use client";

import { containerData } from "@/types/types";
import { Card, Flex, Text, Button } from "@radix-ui/themes";
import { SettingsDialog } from "../settings-dialog";
import { toast } from "react-toastify";
import { stop } from "../../actions/stop-action";
import { start } from "../../actions/start-action";

export const renderShell = (shell: containerData) => {
  const handleStopStart = async () => {
    if (shell.running) {
      toast.info(`Stopping ${shell.name}...`);
      const { success } = await stop(shell);
      if (success) {
        toast.success("Shell stopped!");
      } else {
        toast.error("Error in stopping shell! Please check logs!");
      }
    } else {
      toast.info(`Starting ${shell.name}...`);
      const { success } = await start(shell);
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
            <Button onClick={() => handleStopStart()} color="red">
              Stop
            </Button>
          ) : (
            <Button onClick={() => handleStopStart()}>Start</Button>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};
