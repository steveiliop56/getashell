"use client";

import { SupportedDistros } from "@/types/types";
import { createShellAction } from "../../../actions/create-action";
import { Button, Flex, Select, TextField } from "@radix-ui/themes";
import React, { FormEvent } from "react";
import { toast } from "react-toastify";

interface initialData {
  availableDistros: SupportedDistros;
}

export const CreateShellForm: React.FC<initialData> = ({
  availableDistros,
}) => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    toast.info(
      `Creating shell ${formData.get("name") as string} with distro ${formData.get("distro") as string}...`,
    );
    const { success, shellExists } = await createShellAction(
      formData.get("name") as string,
      formData.get("distro") as string,
      formData.get("extraArguments") as string,
    );
    if (success) {
      toast.success(
        `Shell ${formData.get("name") as string} successfully created!`,
      );
    } else if (shellExists) {
      toast.error("Cannot create shell with same name!");
    } else {
      toast.error(
        `Error in creating shell ${formData.get("name") as string}! Please check logs!`,
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex className="flex-col md:flex-row gap-2">
        <Select.Root required name="distro">
          <Select.Trigger placeholder="Select" />
          <Select.Content>
            <Select.Group>
              {Object.keys(availableDistros).map((distro: string) => (
                <Select.Item value={distro} key={distro}>
                  {availableDistros[distro].name.toString()}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>

        <TextField.Root
          name="name"
          required
          placeholder="Enter a name..."
        ></TextField.Root>

        <TextField.Root
          name="extraArguments"
          placeholder="Enter extra arguments..."
        ></TextField.Root>

        <Button type="submit" color="indigo" variant="soft">
          Get me a shell
        </Button>
      </Flex>
    </form>
  );
};
