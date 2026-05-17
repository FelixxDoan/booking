import { Router } from 'express';
import authenticate from '../../common/middlewares/authenticate.js';
import requireRole from '../../common/middlewares/requireRole.js';
import { createController, detailController, getAllAdminController, getAllController, updateController } from './service.controller.js';
import { validate } from '../../common/middlewares/validate.js';
import { createServiceSchema, updateServiceSchema } from './service.validation.js';

const router = Router();

router.get('/', getAllController)
router.get('/admin', authenticate, requireRole(["ADMIN"]), getAllAdminController)
router.get('/:id', detailController)

router.post('/', authenticate, requireRole(["ADMIN"]), validate(createServiceSchema), createController)
router.patch('/:id', authenticate, requireRole(["ADMIN"]), validate(updateServiceSchema), updateController)

export default router;