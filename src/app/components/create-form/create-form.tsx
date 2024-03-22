"use client";

import { Flex, Button, Select, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { toast } from "react-toastify";

interface props {
  handleCreate: Function;
}

const availableDistos = {
  debian: "Debian",
  ubuntu: "Ubuntu",
  alpine: "Alpine",
  fedora: "Fedora",
  rockylinux: "Rocky Linux",
};

export const CreateForm: React.FC<props> = ({ handleCreate }) => {
  const [distro, setDistro] = useState("select");
  const [name, setName] = useState("");
  const [extaArgs, setExtraArgs] = useState("");

  const handleSubmit = () => {
    if (!(distro == "") && !(name == "")) {
      toast.info(
        `Creating a shell with name "${name}" and distro "${distro}".`,
      );
      handleCreate(name, distro, extaArgs);
    } else {
      toast.error("Please provide both a name and a distro.");
    }
  };

  return (
    <Flex className="flex-col md:flex-row">
      <Select.Root defaultValue="" onValueChange={(e) => setDistro(e)}>
        <Select.Trigger className="m-1" placeholder="Select" />
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
      <TextField.Root className="m-1">
        <TextField.Input
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
      </TextField.Root>
      <TextField.Root className="m-1">
        <TextField.Input
          onChange={(e) => setExtraArgs(e.currentTarget.value)}
          placeholder="Pass exta arguments..."
        />
      </TextField.Root>
      <Button
        className="m-1"
        onClick={() => handleSubmit()}
        color="indigo"
        variant="soft"
      >
        Get me a shell
      </Button>
    </Flex>
  );
};
