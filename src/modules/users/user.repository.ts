import { prisma } from "../../config/db.js";
import { LoginInput, RegisterInput } from "../auth/auth.validation.js";

export const createUser = async ({
  fullName,
  email,
  passwordHash,
}: RegisterInput) => {
  return prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
    },
    select: {
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const findUser = async ({ email }: LoginInput) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id:true,
      email: true,
      role: true,
      passwordHash: true,
    },
  });
};
