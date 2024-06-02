"use client";

import { signupAction } from "@/app/actions/signup-action";
import { Button, Card, Flex, TextField } from "@radix-ui/themes";
import { FormEvent } from "react";
import { toast } from "react-toastify";

export const SignupForm = () => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const passwordVerify = formData.get("password-verify") as string;
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
    }
    if (passwordVerify !== password) {
      toast.error("Passwords do not match!");
      return;
    }
    await signupAction({ username, password });
    toast.success("User created!");
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <Card className="flex flex-col gap-5 p-5">
        <Flex className="flex-col gap-2">
          <p className="font-medium">New username</p>
          <TextField.Root
            placeholder="Enter your username..."
            name="username"
          />
        </Flex>
        <Flex className="flex-col gap-2">
          <p className="font-medium">New password</p>
          <TextField.Root
            placeholder="Enter your password..."
            name="password"
            type="password"
          />
        </Flex>
        <Flex className="flex-col gap-2">
          <p className="font-medium">Verify password</p>
          <TextField.Root
            placeholder="Enter your password again..."
            name="password-verify"
            type="password"
          />
        </Flex>
        <Button type="submit">Login</Button>
      </Card>
    </form>
  );
};
