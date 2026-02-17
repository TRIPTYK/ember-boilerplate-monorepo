import { pino } from "pino";
import type { AppConfiguration } from "../configuration.js";

export function logger(configuration: Pick<AppConfiguration, "PRODUCTION_ENV">) {
  return pino({
    transport: {
      target: configuration.PRODUCTION_ENV ? "pino" : "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  });
}
