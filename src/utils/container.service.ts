import * as util from "util";
import { exec as execCallback } from "child_process";
import { ContainerData, OperationResult } from "../types/types";

export default class ContainerService {
  shell: ContainerData;
  exec: Function;
  containerName: string;

  constructor(shell: ContainerData) {
    this.shell = shell;
    this.exec = util.promisify(execCallback);
    this.containerName = `${this.shell.name}-${this.shell.distro}`;
  }

  private handleError(error: unknown, job: string) {
    console.error(`Error running job ${job}!\nError: ${error}`);
  }

  private async findImageAsync(): Promise<OperationResult> {
    try {
      const { stdout, stderr } = await this.exec(
        `docker image ls --format "{{.Repository}}::{{.Tag}}"`,
      );

      if (stdout.includes(`getashell:${this.shell.distro}`)) {
        return { success: true, error: "", message: "found" };
      } else if (stderr) {
        throw stderr;
      }

      return { success: true, error: "", message: "not-found" };
    } catch (e) {
      this.handleError(e, "findImage");
      return { success: false, error: e };
    }
  }

  private async buildImageAsync(): Promise<OperationResult> {
    try {
      const { message, error, success } = await this.findImageAsync();

      if (success && message == "not-found") {
        const { stdout, stderr } = await this.exec(
          `docker buildx build -t getashell:${this.shell.distro} -f dockerfiles/Dockerfile.${this.shell.distro} .`,
        );

        if (stderr && stderr.includes("ERROR")) {
          throw stderr;
        }
      } else if (error) {
        throw error;
      }

      return { success: true, error: "" };
    } catch (e) {
      this.handleError(e, "buildImage");
      return { success: false, error: e };
    }
  }

  private async findContainerAsync(): Promise<OperationResult> {
    try {
      const { stdout, stderr } = await this.exec(
        `docker container ls -a --format "{{.Names}}"`,
      );

      if (
        stdout.includes(this.containerName) ||
        stderr.includes(this.containerName)
      ) {
        return { success: true, error: "", message: "found" };
      } else if (stderr.includes("Error")) {
        throw stderr;
      }

      return { success: true, error: "", message: "not-found" };
    } catch (e) {
      this.handleError(e, "findContainer");
      return { success: false, error: e };
    }
  }

  private async removeVolumeAsync(): Promise<OperationResult> {
    try {
      const { stdout, stderr } = await this.exec(
        `docker volume rm -f ${this.shell.name}-${this.shell.distro}`,
      );

      if (stderr) {
        throw stderr;
      }

      return { success: true, error: "" };
    } catch (e) {
      this.handleError(e, "removeVolume");
      return { success: false, error: e };
    }
  }

  public async changePasswordAsync(): Promise<OperationResult> {
    try {
      const { stdout, stderr } = await this.exec(
        `docker exec ${this.containerName} sh -c "echo ${this.shell.distro}:${this.shell.password} | chpasswd"`,
      );

      if (stderr && stderr.includes("chpasswd")) {
        console.warn(`Possible chpasswd error: ${stderr}`);
      } else if (stderr) {
        throw stderr;
      }

      return { success: true, error: "" };
    } catch (e) {
      this.handleError(e, "changePassword");
      return { success: false, error: e };
    }
  }

  public async removeContainerAsync(): Promise<OperationResult> {
    try {
      const { success, error, message } = await this.findContainerAsync();

      if (success && message == "found") {
        const { stdout, stderr } = await this.exec(
          `docker rm -f ${this.shell.name}-${this.shell.distro}`,
        );

        if (stderr) {
          throw stderr;
        }

        await this.removeVolumeAsync();
      } else if (error) {
        throw error;
      }

      return { success: true, error: "" };
    } catch (e) {
      this.handleError(e, "removeContainer");
      return { success: false, error: e };
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

        if (stderr && stderr.includes("Error")) {
          throw stderr;
        }

        await this.changePasswordAsync();
      } else if (error) {
        throw error;
      }

      return { success: true, error: "" };
    } catch (e) {
      this.handleError(e, "createContainer");
      return { success: false, error: e };
    }
  }

  public async stopContainerAsync(): Promise<OperationResult> {
    try {
      const { stdout, stderr } = this.exec(`docker stop ${this.containerName}`);

      if (stderr && stderr.includes("Error")) {
        throw stderr;
      }

      return { success: true, error: "" };
    } catch (e) {
      this.handleError(e, "stopContainer");
      return { success: false, error: e };
    }
  }

  public async startContainerAsync(): Promise<OperationResult> {
    try {
      const { stdout, stderr } = this.exec(
        `docker start ${this.containerName}`,
      );

      if (stderr && stderr.includes("Error")) {
        throw stderr;
      }

      return { success: true, error: "" };
    } catch (e) {
      this.handleError(e, "startContainer");
      return { success: false, error: e };
    }
  }
}
