"use client";

import logoutAction from "@/app/actions/logout-action";
import { ExitIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";

export const LogoutButton = () => {
  const handleClick = async () => {
    await logoutAction();
  };
  return (
    <IconButton className="absolute top-5 right-5" onClick={handleClick}>
      <ExitIcon />
    </IconButton>
  );
};
