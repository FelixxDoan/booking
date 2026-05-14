import {Router} from 'express';
import authenticate from '../../common/middlewares/authenticate.js';
import requireRole from '../../common/middlewares/requireRole.js';
import { createController, getAllController, updateController } from './service.controller.js';
import { validate } from '../../common/middlewares/validate.js';
import { createServiceSchema, updateServiceSchema } from './service.validation.js';

const router = Router();

router.get('/all', authenticate, getAllController)
router.post('/create', authenticate, requireRole(["ADMIN", "TUTOR"]),validate(createServiceSchema), createController)
router.patch('/update/:id', authenticate, requireRole(["ADMIN", "TUTOR"]), validate(updateServiceSchema), updateController)

export default router;