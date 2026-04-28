import bcrypt from "bcrypt";
import throwErr from "./throwError.js";

const saltRound = 11;

export const hashPassword = async (rawPassword: string): Promise<string> => {
  if (!rawPassword) throwErr(404, "Missing Password");

  return bcrypt.hash(rawPassword, saltRound);
};

export const comparePassword = async (
  rawPassword: string,
  passwordHash: string,
): Promise<boolean> => {
  if (!rawPassword || !passwordHash) {
    return false;
  }

  return bcrypt.compare(rawPassword, passwordHash);
};
