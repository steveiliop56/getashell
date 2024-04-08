import { logger } from "@/lib/logger";
import { SupportedDistros } from "@/types/types";
import fs from "fs";

export default class distroService {
  logger: typeof logger;

  constructor() {
    this.logger = logger;
  }

  private handleError(error: unknown, job: string) {
    this.logger.error(`Error running job ${job}! Error: ${error}`);
  }

  private getJsonData = () => {
    try {
      const data = fs.readFileSync("distros.json");
      const parsedData = JSON.parse(data.toString());
      return parsedData;
    } catch (e) {
      this.handleError(e, "getJsonData");
      return {};
    }
  };

  public getDistros = () => {
    try {
      const systemArch = process.arch;
      const distros = this.getJsonData();
      let supportedDistros: SupportedDistros = {};

      if (systemArch != "arm64" && systemArch != "x64") {
        this.logger.error("Not supported architecture!");
        return {};
      }

      for (let i = 0; i < Object.keys(distros).length; i++) {
        if (
          distros[Object.keys(distros)[i]].supported_architectures.includes(
            systemArch,
          )
        ) {
          supportedDistros[Object.keys(distros)[i]] =
            distros[Object.keys(distros)[i]];
        }
      }

      return supportedDistros;
    } catch (e) {
      this.handleError(e, "getDistros");
      return {};
    }
  };
}

new distroService().getDistros();
