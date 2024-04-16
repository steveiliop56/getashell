import * as util from "util";
import { exec as execCallback } from "child_process";
import { ContainerData, OperationResult } from "../types/types";
import { logger } from "../lib/logger";

export default class ContainerService {
  shell: ContainerData;
  exec: Function;
  containerName: string;
  logger: typeof logger;
  errorMessages: string[];

  constructor(shell: ContainerData) {
    this.shell = shell;
    this.exec = util.promisify(execCallback);
    this.containerName = `${this.shell.name}-${this.shell.distro}`;
    this.logger = logger;
    this.errorMessages = [
      "Error",
      "ERROR",
      "error",
      "Container not running/doesn't exist.",
      "/bin/sh: 1:",
      "no space left on device",
      "Error running job",
      "Command failed",
    ];
  }

  private handleError(error: any, job: string) {
    this.logger.info(`Job name: ${job}`);
    for (let i = 0; i < this.errorMessages.length; i++) {
      if (error.toString().includes(this.errorMessages[i])) {
        this.logger.error(`Error in job ${job}. Error: ${error}`);
        return { success: false, error: error };
      }
    }
    this.logger.warn(
      `This is probably not an error ${error} in job ${job}... Returning success...`,
    );
    return { success: false, error: "" };
  }

  private async findImageAsync(): Promise<OperationResult> {
    try {
      const { stdout, stderr } = await this.exec(
        `docker image ls --format "{{.Repository}}::{{.Tag}}"`,
      );

      if (stdout.includes(`getashell:${this.shell.distro}`)) {
        return { success: true, error: "", message: "found" };
      }

      return { success: true, error: "", message: "not-found" };
    } catch (e) {
      return this.handleError(e, "findImageAsync");
    }
  }

  private async buildImageAsync(): Promise<OperationResult> {
    try {
      const { message, error, success } = await this.findImageAsync();

      if (success && message == "not-found") {
        const { stdout, stderr } = await this.exec(
          `docker buildx build -t getashell:${this.shell.distro} -f dockerfiles/Dockerfile.${this.shell.distro} .`,
        );
      } else if (error) {
        throw error;
      }
      return { success: true, error: "" };
    } catch (e) {
      return this.handleError(e, "buildImage");
    }
  }

  public async findContainerAsync(running: boolean): Promise<OperationResult> {
    try {
      const { stdout, stderr } = await this.exec(
        `docker container ls ${running ? "-a" : ""} --format "{{.Names}}"`,
      );

      if (
        stdout.includes(this.containerName) ||
        stderr.includes(this.containerName)
      ) {
        return { success: true, error: "", message: "found" };
      }

      return { success: true, error: "", message: "not-found" };
    } catch (e) {
      return this.handleError(e, "findContainer");
    }
  }

  private async removeVolumeAsync(): Promise<OperationResult> {
    try {
      const { stdout, stderr } = await this.exec(
        `docker volume rm -f ${this.shell.name}-${this.shell.distro}`,
      );

      return { success: true, error: "" };
    } catch (e) {
      return this.handleError(e, "removeVolume");
    }
  }

  public async changePasswordAsync(): Promise<OperationResult> {
    try {
      const running = await this.findContainerAsync(false);

      if (running.message == "found" && !running.error) {
        const { stdout, stderr } = await this.exec(
          `docker exec ${this.containerName} sh -c "echo ${this.shell.distro}:${this.shell.password} | chpasswd"`,
        );

        if (stderr && stderr.includes("chpasswd")) {
          this.logger.warn(`Possible chpasswd error: ${stderr}`);
        }
      } else if (running.message != "found") {
        throw "Container not running/doesn't exist.";
      } else if (running.error) {
        throw running.error;
      }

      return { success: true, error: "" };
    } catch (e) {
      return this.handleError(e, "changePassword");
    }
  }

  public async removeContainerAsync(): Promise<OperationResult> {
    try {
      const { success, error, message } = await this.findContainerAsync(true);

      if (success && message == "found") {
        const { stdout, stderr } = await this.exec(
          `docker rm -f ${this.shell.name}-${this.shell.distro}`,
        );

        await this.removeVolumeAsync();
      } else if (error) {
        throw error;
      }

      return { success: true, error: "" };
    } catch (e) {
      return this.handleError(e, "removeContainer");
    }
  }

  public async createContainerAsync(): Promise<OperationResult> {
    try {
      const { success, error } = await this.buildImageAsync();

      if (success) {
        await this.removeContainerAsync();

        const dockerArguments = `-t -d --restart unless-stopped --name ${this.containerName} --hostname ${this.containerName} --volume ${this.containerName}:/home/${this.shell.distro} -p ${this.shell.port}:22 ${this.shell.extraArgs}`;
        const { stdout, stderr } = await this.exec(
          `docker run ${dockerArguments} getashell:${this.shell.distro}`,
        );

        await this.changePasswordAsync();
      } else if (error) {
        throw error;
      }

      return { success: true, error: "" };
    } catch (e) {
      return this.handleError(e, "createContainer");
    }
  }

  public async stopContainerAsync(): Promise<OperationResult> {
    try {
      const { stdout, stderr } = await this.exec(
        `docker stop ${this.containerName}`,
      );

      return { success: true, error: "" };
    } catch (e) {
      return this.handleError(e, "stopContainer");
    }
  }

  public async startContainerAsync(): Promise<OperationResult> {
    try {
      const { stdout, stderr } = await this.exec(
        `docker start ${this.containerName}`,
      );

      return { success: true, error: "" };
    } catch (e) {
      return this.handleError(e, "startContainer");
    }
  }
}
