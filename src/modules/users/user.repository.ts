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
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export type UserByEmail = {
  id: number,
  role: "STUDENT" | "TUTOR" | "ADMIN",
  passwordHash: string,
  email: string
} | null

export const findUserByEmail = async (email: LoginInput) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      role: true,
      passwordHash: true,
      email: true
    },
  });
};


export const findUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      email: true,
      fullName: true,
      status: true,
      id: true,
      role: true,
    },
  });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,

      tutorProfile: {
        select: {
          id: true,
          headline: true,
          bio: true,
          subjects: true,
          yearsOfExperience: true,
          teachingModes: true,
          isActive: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const deleteUser = async (id: number | string) => {
  const transId = typeof (id) === "string" ? Number(id) : id
  return await prisma.user.delete({
    where: {
      id: transId
    }
  })
}