"use server";

import QueriesService from "@/server/queries/queries.service";
import { OperationResult } from "@/types/types";
import ContainerService from "@/utils/container.service";
import { logger } from "@/utils/logger";
import PortService from "@/utils/port.service";
import RandomService from "@/utils/random.service";
import { revalidatePath } from "next/cache";

export async function createShellActionAsync(
  name: string,
  distro: string,
  extraArgs: string,
): Promise<OperationResult> {
  logger.info(
    `Creating shell with name ${name}, distro ${distro}, extra arguments ${extraArgs}...`,
  );

  if (await QueriesService.checkIfShellExistsAsync(name)) {
    return { success: false, shellExists: true };
  }

  let port = await PortService.getAvailablePortAsync();

  const data = {
    id: (await QueriesService.getShellIdsAsync()) + 1,
    distro: distro,
    name: name,
    port: port,
    password: RandomService.createRandomPassword(),
    extraArgs: extraArgs,
    running: true,
  };

  const { success, error } = await new ContainerService(
    data,
  ).createContainerAsync();

  if (success) {
    logger.info("Server ready!");
    await QueriesService.addShellAsync(data);
    revalidatePath("/", "layout");
    return { success: true };
  }
  logger.warn(`Failed to bake server: ${error}`);
  return { success: false };
}
