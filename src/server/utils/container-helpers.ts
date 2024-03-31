import { containerSchema } from "../schemas/container-schmea";
import * as util from "util";
import { exec as execCallback } from "child_process";
import { containerData } from "../types/types";
import { except } from "drizzle-orm/mysql-core";

const exec = util.promisify(execCallback);

export const createContainer = async (shell: containerData) => {
  try {
    if (containerSchema.safeParse(shell).success) {
      const build = await dockerImageBuild(shell.distro);
      if (build.success) {
        const delOldContainer = await deleteOldContainer(shell);

        if (delOldContainer.error) {
          throw delOldContainer.error;
        }
        const createCommand = `docker run -td --restart unless-stopped --hostname ${shell.name} -v ${shell.name}-${shell.distro}:/home/${shell.distro} -p ${shell.port}:22 --name ${shell.name}-${shell.distro} ${shell.extraArgs} getashell:${shell.distro}`;

        const { stdout: createCommandStdout, stderr: createCommandStderr } =
          await exec(createCommand);

        if (createCommandStderr.includes("Error")) {
          throw createCommandStderr;
        }

        const chPasswdOk = await changePassword(shell);
        if (!chPasswdOk.success) {
          console.log("Error changing password!");
          throw chPasswdOk.error;
        }

        return { success: true, error: "" };
      }
      console.error("Docker image build failed!");
      return { success: false, error: "Docker image build failed!" };
    } else {
      console.error("Invalid shell!");
    }
  } catch (e) {
    return { success: false, error: e };
  }
};

export const removeContainer = async (shell: containerData) => {
  try {
    if (containerSchema.safeParse(shell).success) {
      const { stdout: removeStdout, stderr: removeStderr } = await exec(
        `docker rm -f ${shell.name}-${shell.distro}`,
      );

      if (removeStderr) {
        throw removeStderr;
      }

      const { stdout: volumeFindStdout, stderr: volumeFindStderr } = await exec(
        `docker volume ls --format "{{.Name}}"`,
      );

      if (volumeFindStdout.includes(`${shell.name}-${shell.distro}`)) {
        const { stdout: removeVolumeStdout, stderr: removeVolumeStderr } =
          await exec(`docker volume rm ${shell.name}-${shell.distro}`);
      }

      return { success: true, error: "" };
    } else {
      console.error("Invalid shell!");
    }
  } catch (e) {
    return { success: false, error: e };
  }
};

const dockerImageBuild = async (distro: string) => {
  try {
    const { stdout: findStdout, stderr: findStderr } = await exec(
      `docker image ls --format "{{.Repository}}:{{.Tag}}"`,
    );

    if (!findStdout.includes(`getashell:${distro}`)) {
      const { stdout: buildStdout, stderr: buildStderr } = await exec(
        `docker buildx build -t getashell:${distro} -f dockerfiles/Dockerfile.${distro} .`,
      );
      if (buildStderr.includes("ERROR")) {
        throw buildStderr;
      }
    }
    return { success: true, error: "" };
  } catch (e) {
    return { success: false, error: e };
  }
};

const deleteOldContainer = async (shell: containerData) => {
  try {
    const containerName = `${shell.name}-${shell.distro}`;

    const { stdout: findStdout, stderr: findStderr } = await exec(
      `docker ps --format "{{.Names}}"`,
    );

    if (findStderr) {
      throw findStderr;
    } else if (findStdout.includes(containerName)) {
      const { stdout: deleteStdout, stderr: deleteStderr } = await exec(
        `docker rm -f ${containerName}`,
      );

      if (deleteStderr) {
        throw deleteStderr;
      }
    }

    return { success: true, error: "" };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const changePassword = async (shell: containerData) => {
  try {
    const changePasswdCommand = `docker exec ${shell.name}-${shell.distro} sh -c "echo ${shell.distro}:${shell.password} | chpasswd"`;

    const { stdout: chnagePasswdStdout, stderr: changePasswdStderr } =
      await exec(changePasswdCommand);

    if (changePasswdStderr && changePasswdStderr.search("chpasswd") != -1) {
      console.warn(`Possible chpasswd error: Stderr: ${changePasswdStderr}`);
      return { success: true, error: "" };
    } else if (changePasswdStderr) {
      throw changePasswdStderr;
    }
    return { success: true, error: "" };
  } catch (e) {
    return { success: false, error: e };
  }
};
