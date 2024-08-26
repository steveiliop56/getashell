"use server";

import { OperationResult } from "@/types/types";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { generateString } from "@/utils/random";
import PortHelper from "@/lib/helpers/port.helper";
import ContainerHelper from "@/lib/helpers/container.helper";
import { z } from "zod";
import ShellQueries from "@/server/queries/shell/shell.queries";
import { actionClient } from "@/lib/safe-action";

const schema = z.object({
  name: z.string(),
  distro: z.string(),
  extraArgs: z.string(),
});

export const createShellAction = actionClient
  .schema(schema)
  .action(
    async ({
      parsedInput: { name, distro, extraArgs },
    }): Promise<OperationResult> => {
      const shellQueries = new ShellQueries();

      logger.info(
        `Creating shell with name ${name}, distro ${distro}, extra arguments ${
          extraArgs.length !== 0 ? extraArgs : "none"
        }...`
      );

      if (await shellQueries.checkIfShellExists(name)) {
        return { success: false, shellExists: true };
      }

      const port = await new PortHelper().getAvailablePort();

      const data = {
        id: 0,
        distro: distro,
        name: name,
        port: port,
        password: generateString(8),
        extraArgs: extraArgs,
        running: true,
      };

      const { success, error } = await new ContainerHelper(
        data
      ).createContainer();

      if (success) {
        logger.info("Server ready!");
        await shellQueries.addShell(data);
        revalidatePath("/", "layout");
        return { success: true };
      }
      logger.warn(`Failed to bake server: ${error}`);
      return { success: false };
    }
  );
