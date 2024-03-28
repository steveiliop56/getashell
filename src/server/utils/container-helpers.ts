import { containerSchema } from "../schemas/container-schmea";
import * as util from "util";
import { exec as execCallback } from "child_process";
import { containerData } from "../types/types";

const exec = util.promisify(execCallback);

export const createContainer = async (data: containerData) => {
  try {
    if (containerSchema.safeParse(data).success) {
      const build = await dockerImageBuild(data.distro);
      if (build.success) {
        const delOldContainer = await deleteOldContainer(data);

        if (delOldContainer.error) {
          throw delOldContainer.error;
        }
        const createCommand = `docker run -td --hostname ${data.name} -v ${data.name}-${data.distro}:/home/${data.distro} -p ${data.port}:22 --name ${data.name}-${data.distro} ${data.extraArgs} getashell:${data.distro}`;

        const { stdout: createCommandStdout, stderr: createCommandStderr } =
          await exec(createCommand);

        if (createCommandStderr.includes("Error")) {
          throw createCommandStderr;
        }

        const changePasswdCommand = `docker exec ${data.name}-${data.distro} sh -c "echo ${data.distro}:${data.password} | chpasswd"`;

        const { stdout: chnagePasswdStdout, stderr: changePasswdStderr } =
          await exec(changePasswdCommand);

        if (changePasswdStderr && changePasswdStderr.search("chpasswd") != -1) {
          console.warn(
            `Possible chpasswd error: Stderr: ${changePasswdStderr}`,
          );
          return { success: true, error: "" };
        } else if (changePasswdStderr) {
          throw changePasswdStderr;
        }
        return { success: true, error: "" };
      }
      console.error("Docker image build failed!");
      return { success: false, error: "Docker image build failed!" };
    } else {
      console.error("Invalid data!");
    }
  } catch (e) {
    return { success: false, error: e };
  }
};

export const removeContainer = async (data: containerData) => {
  try {
    if (containerSchema.safeParse(data).success) {
      const { stdout: removeStdout, stderr: removeStderr } = await exec(
        `docker rm -f ${data.name}-${data.distro}`,
      );

      if (removeStderr) {
        throw removeStderr;
      }

      const { stdout: volumeFindStdout, stderr: volumeFindStderr } = await exec(
        `docker volume ls --format "{{.Name}}"`,
      );

      if (volumeFindStdout.includes(`${data.name}-${data.distro}`)) {
        const { stdout: removeVolumeStdout, stderr: removeVolumeStderr } =
          await exec(`docker volume rm ${data.name}-${data.distro}`);
      }

      return { success: true, error: "" };
    } else {
      console.error("Invalid data!");
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
    if (findStdout.includes(`getashell:${distro}`)) {
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
