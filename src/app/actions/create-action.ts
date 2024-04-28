"use server";

import QueriesService from "@/server/queries/queries.service";
import { OperationResult } from "@/types/types";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { createRandomPassword } from "@/utils/random";
import PortHelper from "@/helpers/port.helper";
import ContainerHelper from "@/helpers/container.helper";

export async function createShellAction(
  name: string,
  distro: string,
  extraArgs: string,
): Promise<OperationResult> {
  logger.info(
    `Creating shell with name ${name}, distro ${distro}, extra arguments ${extraArgs}...`,
  );

  if (await QueriesService.checkIfShellExists(name)) {
    return { success: false, shellExists: true };
  }

  let port = await PortHelper.getAvailablePort();

  const data = {
    id: (await QueriesService.getShellIds()) + 1,
    distro: distro,
    name: name,
    port: port,
    password: createRandomPassword(),
    extraArgs: extraArgs,
    running: true,
  };

  const { success, error } = await new ContainerHelper(data).createContainer();

  if (success) {
    logger.info("Server ready!");
    await QueriesService.addShell(data);
    revalidatePath("/", "layout");
    return { success: true };
  }
  logger.warn(`Failed to bake server: ${error}`);
  return { success: false };
}
