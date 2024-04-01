import { exec as execCallback } from "child_process";
import * as util from "util";
import { getConfig } from "../config/config";

const exec = util.promisify(execCallback);

export const availablePortChecker = async (port: number) => {
  try {
    const { ncHost } = getConfig();
    const { stdout: tcpStdout, stderr: tcpStderr } = await exec(
      `nc -zv ${ncHost} ${port}`,
    );
    const { stdout: udpStdout, stderr: udpStderr } = await exec(
      `nc -zuv ${ncHost} ${port}`,
    );
    return {
      success: false,
      error: `tcpStdout: ${tcpStdout}\nudpStdout: ${udpStdout}`,
    };
  } catch (e) {
    return { success: true, error: e };
  }
};
