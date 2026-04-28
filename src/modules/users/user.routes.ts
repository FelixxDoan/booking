import { Router } from "express";

import authenticate from "../../common/middlewares/authenticate.js";
import { meController } from "./user.controller.js";

const r = Router();

r.get("/me", authenticate, (req, res) => {
  res.status(200).json({ messege: "getInfo seucee", user: (req as any).user });
});

export default r;
