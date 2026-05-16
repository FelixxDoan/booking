import { Router } from 'express';
import authenticate from '../../common/middlewares/authenticate.js';
import requireRole from '../../common/middlewares/requireRole.js';
import { createController, detailController, getAllController, updateController } from './service.controller.js';
import { validate } from '../../common/middlewares/validate.js';
import { createServiceSchema, updateServiceSchema } from './service.validation.js';

const router = Router();

router.get('/all', getAllController)
router.get('/detail/:id', detailController)
router.post('/create', authenticate, requireRole(["ADMIN"]), validate(createServiceSchema), createController)
router.patch('/update/:id', authenticate, requireRole(["ADMIN"]), validate(updateServiceSchema), updateController)

export default router;