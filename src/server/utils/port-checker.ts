import { exec as execCallback } from "child_process";
import * as util from "util";

const exec = util.promisify(execCallback);

export const availablePortChecker = async (port: number) => {
  try {
    const { stdout: tcpStdout, stderr: tcpStderr } = await exec(
      `nc -zv host.docker.internal ${port}`,
    );
    const { stdout: udpStdout, stderr: udpStderr } = await exec(
      `nc -zuv host.docker.internal ${port}`,
    );
    return {
      success: false,
      error: `tcpStdout: ${tcpStdout}\nudpStdout: ${udpStdout}`,
    };
  } catch (e) {
    return { success: true, error: e };
  }
};
