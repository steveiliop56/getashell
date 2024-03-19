import { containerSchema } from "../schemas/container-schmea";
import * as util from "util";

const exec = util.promisify(require("child_process").exec);

export const spawnContainer = async (data: any) => {
  if (containerSchema.safeParse(data).success) {
    const command = `docker run -td --hostname ${data.name} -p ${data.port}:22 --name ${data.distro}-${data.id} getashell:${data.distro} && docker exec ${data.distro}-${data.id} sh -c "echo ${data.distro}:${data.password} | chpasswd"`;
    const { stdout, stderr } = await exec(command);
    if (stderr) {
      return { success: false, error: stderr };
    } else {
      return { success: true, error: "" };
    }
  } else {
    console.error("Invalid data!");
  }
};
