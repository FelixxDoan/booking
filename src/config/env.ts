import { config } from "dotenv";

config();

const isPresence = <T>(value: T | null | undefined): T => {
  if (value === "" || value === null || typeof value === "undefined") {
    throw new Error("invalid env");
  }

  return value;
};

const isPort = (port: number) => {
  if (port < 1 || port > 65535) {
    throw new Error("out of range port");
  }

  return port;
};

const isTimeOut = (timeOut: number) => {
  if (timeOut < 200 || timeOut > 30000) {
    throw new Error("out of range timeout");
  }

  return timeOut;
};

const isNode = (env: string) => {
  const input = isPresence(env);
  const arr = ["dev", "prod", "test"];

  const node = arr.filter((a) => a === input);

  if (node.length < 1) {
    throw new Error("Invalid node");
  }

  return node[0];
};

const isUrl = (env: string) => {
  const input = isPresence(env);
  const url = new URL(input);

  // const { protocol } = url;
  // if (protocol !== "http:" && protocol !== "https:")
  //   throw new Error("invalid protocol");

  const normalizeUrl = url.toString();

  return normalizeUrl.endsWith("/") ? normalizeUrl.slice(0, -1) : normalizeUrl;
};

const LOG_LEVELS = ["info", "warn", "error", "debug"] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

const parseLogLevel = (lv: string): LogLevel => {
  const value = isPresence(lv);

  if (!LOG_LEVELS.includes(value as LogLevel)) {
    throw new Error("Invalid level");
  }

  return value as LogLevel;
};

const initPort = Number(process.env.PORT);
const initNodeEnv = String(process.env.NDOE_ENV);
const initDB_URL = String(process.env.DATABASE_URL);
const initSecret = String(process.env.JWT_SECRET);
const initTTL = Number(process.env.JWT_TTL);
const initLogLevel = String(process.env.LOG_LEVEL);

const env = () => {
  const port = isPort(initPort);
  const nodeEnv = isNode(initNodeEnv);
  const db_url = isUrl(initDB_URL);
  const level = parseLogLevel(initLogLevel);
  const secret = isPresence(initSecret)
  const ttl = isPresence(initTTL)

  return {
    port,
    nodeEnv,
    db_url,
    level,
    secret,
    ttl
  };
};

export default env;
