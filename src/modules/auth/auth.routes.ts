import { Router } from "express";
import { regiserController } from "./auth.controller.js";
import { registerSchema } from "./auth.validation.js";
import { validate } from "../../common/middlewares/validate.js";

const r = Router();

r.post("/register", validate(registerSchema),regiserController);

export default r;
