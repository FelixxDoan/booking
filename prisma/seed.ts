import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  UserRole,
  UserStatus,
} from "../src/generated/prisma/client.js";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaPg({
  connectionString: dbUrl,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      fullName: "Demo Admin",
      email: "admin@example.com",
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: "tutor@example.com" },
    update: {},
    create: {
      fullName: "Demo Tutor",
      email: "tutor@example.com",
      passwordHash,
      role: UserRole.TUTOR,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      fullName: "Demo Student",
      email: "student@example.com",
      passwordHash,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });