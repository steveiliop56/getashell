"use server";

import { revalidatePath } from "next/cache";
import { OperationResult } from "@/types/types";
import ContainerHelper from "@/lib/helpers/container.helper";
import { logger } from "@/lib/logger";
import { z } from "zod";
import { shellSchema } from "@/schemas/shellSchema";
import ShellQueries from "@/server/queries/shell/shell.queries";
import { actionClient } from "@/lib/safe-action";

const schema = z.object({
  shell: shellSchema,
  newPassword: z.string(),
});

export const changeShellPasswordAction = actionClient
  .schema(schema)
  .action(
    async ({
      parsedInput: { shell, newPassword },
    }): Promise<OperationResult> => {
      shell.password = newPassword;

      const { success, error } = await new ContainerHelper(
        shell
      ).changePassword();

      if (success) {
        const shellQueries = new ShellQueries();
        logger.info("Password changed!");
        await shellQueries.changeShellPassword(shell);
        revalidatePath("/", "layout");
        return { success: true };
      }

      logger.error(`Error changing password! Error: ${error}`);
      return { success: false };
    }
  );
