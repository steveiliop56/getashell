"use client";

import { create } from "../../actions/create-action";
import { Button, Flex, Select, TextField } from "@radix-ui/themes";
import { FormEvent } from "react";
import { toast } from "react-toastify";

const availableDistos = {
  debian: "Debian",
  ubuntu: "Ubuntu",
  alpine: "Alpine",
  fedora: "Fedora",
  rockylinux: "Rocky Linux",
};

export const CreateShellForm = () => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    toast.info(
      `Creating shell ${formData.get("name") as string} with distro ${formData.get("distro") as string}...`,
    );
    const { success, shellExists } = await create(
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
              {Object.keys(availableDistos).map((distro: string) => (
                <Select.Item value={distro} key={distro}>
                  {availableDistos[distro as keyof typeof availableDistos]}
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
