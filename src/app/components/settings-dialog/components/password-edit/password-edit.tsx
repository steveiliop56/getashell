import { change } from "../../../../actions/change-password-action";
import { containerData } from "@/types/types";
import { Pencil1Icon, GearIcon } from "@radix-ui/react-icons";
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
import React, { FormEvent } from "react";
import { toast } from "react-toastify";

interface shellData {
  shell: containerData;
}

export const PasswordEdit: React.FC<shellData> = ({ shell }) => {
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
