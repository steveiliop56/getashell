import { exec as execCallback } from "child_process";
import * as util from "util";
import { getConfig } from "../config/config";
import { createRandomPort } from "./random-generator";
import { portAvailable } from "@/server/queries/queries";

const exec = util.promisify(execCallback);

const availablePortChecker = async (port: number) => {
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

export const getAvailablePort = async () => {
  let port: number | undefined;
  do {
    if (port) console.log(`Port ${port} isn't available. Generating a new port...`);
    port = createRandomPort();
    console.log(`Generated port ${port}. Checking it's not already in use...`)
  } while (!(await availablePortChecker(port)).success || !portAvailable(port));
  console.log(`Success! Using port ${port}`);
  return port;
}
