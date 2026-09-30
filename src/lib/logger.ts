import { pino } from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  level: env.LOG_LEVEL,
  timestamp: pino.stdTimeFunctions.isoTime,
  // Development: one readable line per event. Production: plain JSON for log tooling.
  ...(env.NODE_ENV === "development" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss.l'Z'",
        ignore: "pid,hostname,req,res,responseTime,reqId",
        messageFormat: "{msg}{if reqId} [reqId: {reqId}]{end}",
      },
    },
  }),
});
