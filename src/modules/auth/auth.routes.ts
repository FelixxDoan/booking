import { Router } from "express";
import { regiserController, loginController, meController } from "./auth.controller.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { validate } from "../../common/middlewares/validate.js";
import authenticate from "../../common/middlewares/authenticate.js";

const r = Router();

r.post("/register", validate(registerSchema),regiserController);
r.post("/login", validate(loginSchema),loginController);
r.get("/me", authenticate,meController);

export default r;
