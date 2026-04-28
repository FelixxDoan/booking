import { Prisma } from "../../generated/prisma/client.js";
import { hashPassword } from "../../common/utils/password.js";
import throwErr from "../../common/utils/throwError.js";
import { createUser } from "../users/user.repository.js";

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
};

export const registerService = async ({
  fullName,
  email,
  password,
}: RegisterInput) => {
  const passwordHash = await hashPassword(password);

  try {
    const user = await createUser({
      fullName,
      email,
      passwordHash,
    });

    return {
      data: user,
      message: "Register Success",
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target;

      if (Array.isArray(target) && target.includes("email")) {
        throwErr(409, "Email already exists");
      }

      throwErr(409, "Duplicate value already exists");
    }

    throw error;
  }
};