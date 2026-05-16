import {Router} from "express";

import { getAllTutorsController, getTutorByIdController } from "./tutor.controller.js";
import authenticate from "@common/middlewares/authenticate.js";
import requireRole from "@common/middlewares/requireRole.js";

const router = Router();

router.get('/all',authenticate,requireRole(['ADMIN']), getAllTutorsController)
router.get('/:id',authenticate,requireRole(['ADMIN']), getTutorByIdController)

export default router;