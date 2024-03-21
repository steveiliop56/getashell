import { containerSchema } from "../schemas/container-schmea";
import * as util from "util";
import { containerData } from "../types/types";

const exec = util.promisify(require("child_process").exec);

export const createContainer = async (data: containerData) => {
  if (containerSchema.safeParse(data).success) {
    const createCommand = `docker run -td --hostname ${data.name} -p ${data.port}:22 --name ${data.name}-${data.distro} getashell:${data.distro}`;

    const { createCommandStdout, createCommandStderr } =
      await exec(createCommand);

    if (createCommandStderr) {
      return { success: false, error: createCommandStderr };
    }

    const changePasswordCommand = `docker exec ${data.name}-${data.distro} sh -c "echo ${data.distro}:${data.password} | chpasswd"`;

    const { changePasswordCommandStdout, changePasswordCommandStderr } =
      await exec(changePasswordCommand);

    if (
      changePasswordCommandStderr &&
      changePasswordCommandStderr.search("chpasswd") != -1
    ) {
      console.warn(
        `Possible chpasswd error: Stderr: ${changePasswordCommandStderr}`,
      );
      return { success: true, error: "" };
    } else if (changePasswordCommandStderr) {
      return { success: false, error: changePasswordCommandStderr };
    } else {
      return { success: true, error: "" };
    }
  } else {
    console.error("Invalid data!");
  }
};

export const removeContainer = async (data: containerData) => {
  if (containerSchema.safeParse(data).success) {
    const { stdout, stderr } = await exec(
      `docker rm -f ${data.name}-${data.distro}`,
    );

    if (stderr) {
      return { success: false, error: stderr };
    } else {
      return { success: true, error: "" };
    }
  } else {
    console.error("Invalid data!");
  }
};
