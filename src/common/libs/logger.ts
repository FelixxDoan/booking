import pino from "pino";

export const createLogger = ({ nodeEnv, stream, level }: any) => {
  return pino(
    {
      level,
      base: {
        nodeEnv,
      },
      timestamp: pino.stdTimeFunctions.isoTime,
      redact: {
        paths: [
          "req.headers.authorization",
          "req.headers.cookie",
          "req.headers.set-cookie",
          "headers.authorization",
          "headers.cookie",
          "headers.set-cookie",
          "authorization",
          "cookie",
          "password",
          "token",
          "refreshToken",
        ],
        censor: "[REDACTEZ]",
      },
    },
    stream,
  );
};


