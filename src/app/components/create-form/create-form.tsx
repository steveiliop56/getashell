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

  const handleSubmit = () => {
    if (!(distro == "select") && !(name == "")) {
      toast.info(
        `Creating a shell with name "${name}" and distro "${distro}".`,
      );
      handleCreate(name, distro);
    } else {
      toast.error("Please provide both a name and a distro.");
    }
  };

  return (
    <Flex className="flex-row">
      <Select.Root defaultValue="select" onValueChange={(e) => setDistro(e)}>
        <Select.Trigger />
        <Select.Content>
          <Select.Group>
            <Select.Item disabled={true} value={"select"}>
              Select
            </Select.Item>
            {Object.keys(availableDistos).map((distro: string) => (
              <Select.Item value={distro} key={distro}>
                {availableDistos[distro as keyof typeof availableDistos]}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <TextField.Root className="ml-2 mr-5">
        <TextField.Input
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
      </TextField.Root>
      <Button onClick={() => handleSubmit()} color="indigo" variant="soft">
        Get me a shell
      </Button>
    </Flex>
  );
};
