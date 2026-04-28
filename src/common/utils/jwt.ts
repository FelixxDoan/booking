import jwt from "jsonwebtoken";
import env from "../../config/env.js";
import throwErr from "./throwError.js";

const { secret, ttl } = env();

export type JwtPayload = {
  id: number;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  email: string;
};

export const signToken = (payload: JwtPayload) => {
  if (!payload) throwErr(400, "Missing Payload");

  return jwt.sign(payload, secret, { expiresIn: ttl || "10h" });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, secret);
};
