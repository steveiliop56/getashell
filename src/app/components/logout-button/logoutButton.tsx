"use client";

import { logoutAction } from "../../actions/logout-action";
import { ExitIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";

export const LogoutButton = () => {
  return (
    <IconButton
      className="absolute top-5 right-5"
      data-testid="logout-button"
      onClick={async () => {
        await logoutAction();
      }}
    >
      <ExitIcon />
    </IconButton>
  );
};
