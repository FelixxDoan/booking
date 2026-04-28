import { Router } from "express";
import { regiserController, loginController } from "./auth.controller.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { validate } from "../../common/middlewares/validate.js";

const r = Router();

r.post("/register", validate(registerSchema),regiserController);
r.post("/login", validate(loginSchema),loginController);

export default r;
