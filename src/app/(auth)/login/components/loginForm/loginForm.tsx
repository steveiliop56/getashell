"use client";

import { loginAction } from "@/app/actions/login-action";
import { Button, Card, Flex, TextField } from "@radix-ui/themes";
import { FormEvent } from "react";
import { toast } from "react-toastify";

export const LoginForm = () => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const result = await loginAction({ username, password });
    if (result) {
      if (!result.data?.success) toast.error("Invalid login!");
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <Card className="flex flex-col gap-5 p-5">
        <Flex className="flex-col gap-2">
          <p className="font-medium">Username</p>
          <TextField.Root
            placeholder="Enter your username..."
            name="username"
          />
        </Flex>
        <Flex className="flex-col gap-2">
          <p className="font-medium">Password</p>
          <TextField.Root
            placeholder="Enter your password..."
            name="password"
            type="password"
          />
        </Flex>
        <Button type="submit">Login</Button>
      </Card>
    </form>
  );
};
