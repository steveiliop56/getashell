import * as util from "util";
import { exec as execCallback } from "child_process";

const exec = util.promisify(execCallback);

export const deleteContainer = async (name: string) => {
  const { stdout: containerRMStdout, stderr: containerRMStderr } = await exec(
    `docker rm -f ${name}`,
  );
  if (containerRMStderr) {
    console.error(containerRMStderr);
  } else if (containerRMStdout) {
    console.log(containerRMStdout);
  }
  const { stdout: volumeRMStdout, stderr: volumeRMStderr } = await exec(
    `docker volume rm -f ${name}`,
  );
  if (volumeRMStderr) {
    console.error(volumeRMStderr);
  } else if (volumeRMStdout) {
    console.log(containerRMStdout);
  }
};
