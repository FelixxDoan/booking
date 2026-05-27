import { Router } from "express";

import authenticate from "../../common/middlewares/authenticate.js";
import { createTutorController, meController } from "./user.controller.js";
import requireRole from "../../common/middlewares/requireRole.js";

const r = Router();

r.post('/admin/tutor', authenticate, requireRole(["ADMIN"]), createTutorController)


export default r;
