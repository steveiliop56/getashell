import * as util from "util";
import { exec as execCallback } from "child_process";
import { ContainerData, OperationResult } from "../../types/types";
import { logger } from "../logger";

export default class ContainerHelper {
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
      "Container not running/doesn't exist.",
      "/bin/sh: 1:",
      "no space left on device",
      "Error running job",
      "Command failed",
    ];
  }

  private handleError = (error: any, job: string) => {
    this.logger.info(`Job name: ${job}`);
    for (let i = 0; i < this.errorMessages.length; i++) {
      if (error.toString().includes(this.errorMessages[i])) {
        this.logger.error(`Error in job ${job}. Error: ${error}`);
        return { success: false, error: error };
      }
    }
    this.logger.warn(
      `This is probably not an error ${error} in job ${job}... Returning success...`
    );
    return { success: true, error: "" };
  };

  private findImage = async (): Promise<OperationResult> => {
    try {
      const { stdout, stderr } = await this.exec(
        `docker image ls --format "{{.Repository}}::{{.Tag}}"`
      );

      if (stdout.includes(`getashell:${this.shell.distro}`)) {
        return { success: true, error: "", message: "found" };
      }

      return { success: true, error: "", message: "not-found" };
    } catch (e) {
      return this.handleError(e, "findImage");
    }
  };

  private buildImage = async (): Promise<OperationResult> => {
    try {
      const { message, error, success } = await this.findImage();

      if (success && message == "not-found") {
        const { stdout, stderr } = await this.exec(
          `docker buildx build -t getashell:${this.shell.distro} -f dockerfiles/Dockerfile.${this.shell.distro} .`
        );

        if (stderr) {
          throw stderr;
        }
      } else if (error) {
        throw error;
      }
      return { success: true, error: "" };
    } catch (e) {
      return this.handleError(e, "buildImage");
    }
  };

  public findContainer = async (running: boolean): Promise<OperationResult> => {
    try {
      const { stdout, stderr } = await this.exec(
        `docker container ls ${running ? "-a" : ""} --format "{{.Names}}"`
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
  };

  private removeVolume = async (): Promise<OperationResult> => {
    try {
      const { stdout, stderr } = await this.exec(
        `docker volume rm -f ${this.shell.name}-${this.shell.distro}`
      );

      if (stderr) {
        throw stderr;
      }

      return { success: true, error: "" };
    } catch (e) {
      return this.handleError(e, "removeVolume");
    }
  };

  public changePassword = async (): Promise<OperationResult> => {
    try {
      const running = await this.findContainer(false);

      if (running.message == "found" && !running.error) {
        const { stdout, stderr } = await this.exec(
          `docker exec ${this.containerName} sh -c "echo ${this.shell.distro}:${this.shell.password} | chpasswd"`
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
  };

  public removeContainer = async (): Promise<OperationResult> => {
    try {
      const { success, error, message } = await this.findContainer(true);

      if (success && message == "found") {
        const { stdout, stderr } = await this.exec(
          `docker rm -f ${this.shell.name}-${this.shell.distro}`
        );

        if (stderr) {
          throw stderr;
        }

        const remove = await this.removeVolume();

        if (remove.error) {
          throw remove.error;
        }
      } else if (error) {
        throw error;
      }

      return { success: true, error: "" };
    } catch (e) {
      return this.handleError(e, "removeContainer");
    }
  };

  public createContainer = async (): Promise<OperationResult> => {
    try {
      const { success, error } = await this.buildImage();

      if (success) {
        const remove = await this.removeContainer();
        if (remove.error) {
          throw remove.error;
        }

        const dockerArguments = `-t -d --restart unless-stopped --name ${this.containerName} --hostname ${this.containerName} --volume ${this.containerName}:/home/${this.shell.distro} -p ${this.shell.port}:22 ${this.shell.extraArgs}`;
        const { stdout, stderr } = await this.exec(
          `docker run ${dockerArguments} getashell:${this.shell.distro}`
        );

        if (stderr) {
          throw stderr;
        }

        const change = await this.changePassword();

        if (change.error) {
          throw change.error;
        }
      } else if (error) {
        throw error;
      }

      return { success: true, error: "" };
    } catch (e) {
      return this.handleError(e, "createContainer");
    }
  };

  public stopContainer = async (): Promise<OperationResult> => {
    try {
      const { stdout, stderr } = await this.exec(
        `docker stop ${this.containerName}`
      );

      if (stderr) {
        throw stderr;
      }

      return { success: true, error: "" };
    } catch (e) {
      return this.handleError(e, "stopContainer");
    }
  };

  public startContainer = async (): Promise<OperationResult> => {
    try {
      const { stdout, stderr } = await this.exec(
        `docker start ${this.containerName}`
      );

      if (stderr) {
        throw stderr;
      }

      return { success: true, error: "" };
    } catch (e) {
      return this.handleError(e, "startContainer");
    }
  };
}
