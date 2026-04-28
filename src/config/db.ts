import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import env from "./env.js";
import type { Logger } from "pino";

const { db_url } = env();

const adapter = new PrismaPg({
  connectionString: db_url,
});

const prisma = new PrismaClient({ adapter });

const connectDB = async (logger: Logger) => {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error({ error }, "Failed to connect to database");
    process.exit(1);
  }
};

export { prisma, connectDB };