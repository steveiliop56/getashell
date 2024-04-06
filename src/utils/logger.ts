import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.colorize(),
    format.align(),
    format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    format.printf(
      (info) =>
        `${info.service}: ${info.timestamp} - ${info.level}: ${info.message}`,
    ),
  ),
  defaultMeta: { service: "getashell" },
  transports: [new transports.Console()],
});
