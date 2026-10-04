import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";

export class HttpError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

interface ExposedClientError {
  status: number;
  message: string;
  type?: string;
}

// http-errors (used by body-parser) marks errors that are safe to show the client with `expose: true`
const isExposedClientError = (err: unknown): err is ExposedClientError =>
  err instanceof Error &&
  "expose" in err &&
  err.expose === true &&
  "status" in err &&
  typeof err.status === "number" &&
  err.status >= 400 &&
  err.status < 500;

export const notFound: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ message: "Validation failed", errors: err.issues });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Client errors raised by Express/body-parser (malformed JSON, payload too large, ...)
  if (isExposedClientError(err)) {
    const message = err.type === "entity.parse.failed" ? "Malformed JSON in request body" : err.message;
    res.status(err.status).json({ message });
    return;
  }

  // Hand the error to pino-http so it's logged (with stack) on the request's own log line
  res.err = err instanceof Error ? err : new Error(String(err));
  res.status(500).json({ message: "Internal server error" });
};
