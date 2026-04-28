import { ErrorRequestHandler } from "express";

const codes: Record<number, string> = {
  400: "VALIDATION_ERROR",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  429: "RATE_LIMITED",
  500: "INTERNAL_SERVER_ERROR",
  504: "UPSTREAM_TIMEOUT",
};

const handleError: ErrorRequestHandler = (err, req, res, next) => {
  const error = err as Error & { statusCode?: number };

  const statusCode = error.statusCode ?? 500;
  const message = error.message ?? "Request rejected";
  const errCode = codes[statusCode] ?? "INTERNAL_SERVER_ERROR";

  res.status(statusCode).json({
    success: false,
    message,
    errCode,
  });
};

export default handleError;
