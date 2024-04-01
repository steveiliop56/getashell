import * as util from "util";
import { exec as execCallback } from "child_process";
import { containerData } from "../types/types";

export class containerHelpers {
  shell: containerData;
  exec: Function;
  containerName: string;

  constructor(shell: containerData) {
    this.shell = shell;
    this.exec = util.promisify(execCallback);
    this.containerName = `${this.shell.name}-${this.shell.distro}`;
  }

  private handleError = (error: unknown, job: string) => {
    console.error(`Error running job ${job}!\nError: ${error}`);
  };

  private findImage = async () => {
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
  };

  private buildImage = async () => {
    try {
      const { message, error, success } = await this.findImage();

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
  };

  private findContainer = async () => {
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
  };

  private removeVolume = async () => {
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
  };

  public changePassword = async () => {
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
  };

  public removeContainer = async () => {
    try {
      const { success, error, message } = await this.findContainer();

      if (success && message == "found") {
        const { stdout, stderr } = await this.exec(
          `docker rm -f ${this.shell.name}-${this.shell.distro}`,
        );

        if (stderr) {
          throw stderr;
        }

        await this.removeVolume();
      } else if (error) {
        throw error;
      }

      return { success: true, error: "" };
    } catch (e) {
      this.handleError(e, "removeContainer");
      return { success: false, error: e };
    }
  };

  public createContainer = async () => {
    try {
      const { success, error } = await this.buildImage();

      if (success) {
        await this.removeContainer();

        const dockerArguments = `-t -d --restart unless-stopped --name ${this.containerName} --hostname ${this.containerName} --volume ${this.containerName}:/home/${this.shell.distro} -p ${this.shell.port}:22`;
        const { stdout, stderr } = await this.exec(
          `docker run ${dockerArguments} getashell:${this.shell.distro}`,
        );

        if (stderr && stderr.includes("Error")) {
          throw stderr;
        }

        await this.changePassword();
      } else if (error) {
        throw error;
      }

      return { success: true, error: "" };
    } catch (e) {
      this.handleError(e, "createContainer");
      return { success: false, error: e };
    }
  };

  public stopContainer = async () => {
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
  };

  public startContainer = async () => {
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
  };
}
