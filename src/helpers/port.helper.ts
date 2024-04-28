import { exec as execCallback } from "child_process";
import * as util from "util";
import { getConfig } from "../config/config";
import QueriesService from "@/server/queries/queries.service";
import { logger } from "../lib/logger";

export default class PortHelper {
  private static exec = util.promisify(execCallback);

  public static async getAvailablePort(): Promise<number> {
    let port: number | undefined;
    do {
      if (port)
        logger.warn(`Port ${port} isn't available. Generating a new port...`);
      port = this.generateRandomPort();
      logger.info(
        `Generated port ${port}. Checking it's not already in use...`,
      );
    } while (
      !(await this.checkPortIsAvailable(port)).success ||
      !QueriesService.isPortAvailable(port)
    );
    logger.info(`Success! Using port ${port}`);
    return port;
  }

  private static generateRandomPort(): number {
    return Math.floor(Math.random() * (10000 - 1023)) + 1023;
  }

  private static async checkPortIsAvailable(
    port: number,
  ): Promise<{ success: boolean; error: unknown }> {
    try {
      const { ncHost } = getConfig();
      const { stdout: tcpStdout, stderr: tcpStderr } = await this.exec(
        `nc -zv ${ncHost} ${port}`,
      );
      const { stdout: udpStdout, stderr: udpStderr } = await this.exec(
        `nc -zuv ${ncHost} ${port}`,
      );
      return {
        success: false,
        error: `tcpStdout: ${tcpStdout}\nudpStdout: ${udpStdout}`,
      };
    } catch (e) {
      return { success: true, error: e };
    }
  }
}
