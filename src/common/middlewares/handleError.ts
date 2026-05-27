import type { ErrorRequestHandler } from "express";

const codes: Record<number, string> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "VALIDATION_ERROR",
  500: "INTERNAL_SERVER_ERROR",
  502: "BAD_GATEWAY",
  503: "SERVICE_UNAVAILABLE",
  504: "UPSTREAM_TIMEOUT",
};

const formatErrorLines = (message: string) => {
  return message
    .split(/\n|\\n/)
    .map((line) => line.trim())
    .filter(Boolean);
};

const handleError: ErrorRequestHandler = (err, req, res, _next) => {
  const error = err as Error & { statusCode?: number };

  const statusCode = error.statusCode ?? 500;
  const rawMessage = error.message || "Request rejected";
  const errCode = codes[statusCode] ?? "INTERNAL_SERVER_ERROR";

  res.status(statusCode).json({
    success: false,
    errCode,
    message: formatErrorLines(rawMessage),
  });
};

export default handleError;