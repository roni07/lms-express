import { randomUUID } from "node:crypto";
import type { Request, RequestHandler, Response } from "express";
import { pinoHttp } from "pino-http";
import { logger } from "../lib/logger.js";

// Express reports IPv4 clients as IPv4-mapped IPv6 (::ffff:1.2.3.4); show the plain IPv4 form
const clientIp = (req: Request) => req.ip?.replace(/^::ffff:/, "") ?? "-";

const clientInfo = (req: Request) => `${clientIp(req)}, ${req.get("user-agent") ?? "-"}`;

export const requestLogger = pinoHttp<Request, Response>({
  logger,

  // Reuse an incoming X-Request-Id (e.g. from a proxy) or create one, and echo it back to the client
  genReqId: (req, res) => {
    const incoming = req.headers["x-request-id"];
    const id = typeof incoming === "string" && incoming ? incoming : randomUUID();
    res.setHeader("X-Request-Id", id);
    return id;
  },

  // Child logger (req.log) only carries the request id instead of the whole request
  quietReqLogger: true,

  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },

  customSuccessMessage: (req, res, responseTime) =>
    `${req.method} ${req.originalUrl} ${res.statusCode} - ${Math.round(responseTime)}ms (${clientInfo(req)})`,

  customErrorMessage: (req, res, err) =>
    `${req.method} ${req.originalUrl} ${res.statusCode} - ${err.message} (${clientInfo(req)})`,

  // Keep only the fields worth indexing; never log headers (cookies, auth tokens)
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      ip: clientIp(req.raw as Request),
      userAgent: req.headers["user-agent"],
    }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
});

const SENSITIVE_KEYS = new Set([
  "password",
  "newpassword",
  "oldpassword",
  "confirmpassword",
  "token",
  "accesstoken",
  "refreshtoken",
  "secret",
  "otp",
]);

const redact = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) =>
        SENSITIVE_KEYS.has(key.toLowerCase()) ? [key, "[REDACTED]"] : [key, redact(val)],
      ),
    );
  }
  return value;
};

// Logs the parsed request body at debug level only (LOG_LEVEL=debug), with sensitive fields redacted
export const requestBodyLogger: RequestHandler = (req, _res, next) => {
  const hasBody = req.body && typeof req.body === "object" && Object.keys(req.body).length > 0;
  if (hasBody && req.log.isLevelEnabled("debug")) {
    req.log.debug({ body: redact(req.body) }, `${req.method} ${req.originalUrl} request body`);
  }
  next();
};
