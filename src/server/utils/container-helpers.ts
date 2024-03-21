import { containerSchema } from "../schemas/container-schmea";
import * as util from "util";
import { exec as execCallback } from "child_process";
import { containerData } from "../types/types";

const exec = util.promisify(execCallback);

export const createContainer = async (data: containerData) => {
  if (containerSchema.safeParse(data).success) {
    const build = await dockerImageBuild(data.distro);
    if (build.success) {
      const createCommand = `docker run -td --hostname ${data.name} -p ${data.port}:22 --name ${data.name}-${data.distro} getashell:${data.distro}`;

      const { stdout: createCommandStdout, stderr: createCommandStderr } =
        await exec(createCommand);

      if (createCommandStderr) {
        return { success: false, error: createCommandStderr };
      }

      const changePasswdCommand = `docker exec ${data.name}-${data.distro} sh -c "echo ${data.distro}:${data.password} | chpasswd"`;

      const { stdout: chnagePasswdStdout, stderr: changePasswdStderr } =
        await exec(changePasswdCommand);

      if (changePasswdStderr && changePasswdStderr.search("chpasswd") != -1) {
        console.warn(`Possible chpasswd error: Stderr: ${changePasswdStderr}`);
        return { success: true, error: "" };
      } else if (changePasswdStderr) {
        return { success: false, error: changePasswdStderr };
      }
      return { success: true, error: "" };
    }
    console.error("Docker image build failed!");
    return { success: false, error: "Docker image build failed!" };
  } else {
    console.error("Invalid data!");
  }
};

export const removeContainer = async (data: containerData) => {
  if (containerSchema.safeParse(data).success) {
    const { stdout: removeStdout, stderr: removeStderr } = await exec(
      `docker rm -f ${data.name}-${data.distro}`,
    );

    if (removeStderr) {
      return { success: false, error: removeStderr };
    }
    return { success: true, error: "" };
  } else {
    console.error("Invalid data!");
  }
};

const dockerImageBuild = async (distro: string) => {
  const { stdout: findStdout, stderr: findStderr } = await exec(
    `docker image ls --format "{{.Repository}}:{{.Tag}}"`,
  );
  if (findStdout.search(`getashell:${distro}`) == -1) {
    const { stdout: buildStdout, stderr: buildStderr } = await exec(
      `docker buildx build -t getashell:${distro} -f dockerfiles/Dockerfile.${distro} .`,
    );
    if (buildStderr.search("ERROR") != -1) {
      return { success: false, error: buildStderr };
    }
  }
  return { success: true, error: "" };
};
