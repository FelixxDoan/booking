import {Router} from 'express';
import authenticate from '../../common/middlewares/authenticate.js';
import requireRole from '../../common/middlewares/requireRole.js';
import { createController } from './service.controller.js';
import { validate } from '../../common/middlewares/validate.js';
import { createServiceSchema } from './service.validation.js';

const router = Router();

router.post('/create', authenticate, requireRole(["ADMIN", "TUTOR"]),validate(createServiceSchema), createController)

export default router;