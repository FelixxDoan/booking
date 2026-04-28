import { prisma } from "../../config/db.js";

type CreateUserInput = {
  fullName: string;
  email: string;
  passwordHash: string;
};

export const createUser = async ({
  fullName,
  email,
  passwordHash,
}: CreateUserInput) => {
  return prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};