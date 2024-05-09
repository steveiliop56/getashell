"use server";

import QueriesService from "@/server/queries/queries.service";
import { OperationResult } from "@/types/types";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { generateString } from "@/utils/random";
import PortHelper from "@/helpers/port.helper";
import ContainerHelper from "@/helpers/container.helper";
import { z } from "zod";
import { action } from "@/lib/safe-action";

const schema = z.object({
  name: z.string(),
  distro: z.string(),
  extraArgs: z.string(),
});

export const createShellAction = action(
  schema,
  async ({ name, distro, extraArgs }): Promise<OperationResult> => {
    logger.info(
      `Creating shell with name ${name}, distro ${distro}, extra arguments ${extraArgs}...`,
    );

    if (await QueriesService.checkIfShellExists(name)) {
      return { success: false, shellExists: true };
    }

    let port = await PortHelper.getAvailablePort();

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
      data,
    ).createContainer();

    if (success) {
      logger.info("Server ready!");
      await QueriesService.addShell(data);
      revalidatePath("/home", "layout");
      return { success: true };
    }
    logger.warn(`Failed to bake server: ${error}`);
    return { success: false };
  },
);
