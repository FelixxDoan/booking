import { Router } from "express";

import authenticate from "../../common/middlewares/authenticate.js";
import { meController } from "./user.controller.js";
import requireRole from "../../common/middlewares/requireRole.js";

const r = Router();


export default r;
