import { RequestHandler } from "express";
import throwErr from "../utils/throwError.js";
import { verifyToken } from "../utils/jwt.js";

const authenticate: RequestHandler = (req, res, next) => {
  const auth = req.headers["authorization"];

  if (!auth) throwErr(401, "Missing credentital");

  if (!auth?.startsWith("Bearer ")) throwErr(401, "Invalid token");

  const token = auth?.split(" ")[1];
  if (!token) return throwErr(401, "Missing token");

  const payload = verifyToken(token);

  (req as any).user = {
    id: payload.id,
    role: payload.role,
    email: payload.email,
  };

  next();
};

export default authenticate;
