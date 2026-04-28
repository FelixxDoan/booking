import { Prisma } from "../../generated/prisma/client.js";
import { hashPassword, comparePassword } from "../../common/utils/password.js";
import throwErr from "../../common/utils/throwError.js";
import { createUser, findUser } from "../users/user.repository.js";
import { LoginInput, RegisterInput } from "./auth.validation.js";
import { signToken } from "../../common/utils/jwt.js";

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

export const loginService = async ({ email, password }: LoginInput) => {
  const user = await findUser({ email });
  if (!user) return throwErr(401, "Invalid email or password");

  const checkPassword = await comparePassword(password, user.passwordHash);
  if (!checkPassword) return throwErr(401, "Invalid email or password");

  const { passwordHash, ...payload } = user;

  const token = signToken(payload);

  return {
    data: {token},
    message: "Login Success",
  };
};
