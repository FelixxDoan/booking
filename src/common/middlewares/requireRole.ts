import { RequestHandler } from "express";
import throwErr from "../utils/throwError.js";

type Role = "STUDENT" | "TUTOR" | "ADMIN";
    
const requireRole = (roleInput: Role[]):RequestHandler => (req, res, next) => {
    const role = req.user?.role

    if (!role) return throwErr(400, "Mssing role")

    if(!roleInput.includes(role)) return throwErr(403, "Invalid role")

    next()
}

export default requireRole