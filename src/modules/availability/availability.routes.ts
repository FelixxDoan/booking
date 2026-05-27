import { validate } from "@common/middlewares/validate.js";
import { Router } from "express";
import { availabilityQuerySchema, 
    createBlockedSlotSchema, 
    updateWorkingHoursSchema } from "./availability.validation.js";
import { availabilityQueryController, 
    createBlockedSlotController, 
    getBlockedSlotController, 
    deleteBlockedSlotController,
    getWorkingHoursController, 
    updateWorkingHoursController } from "./avalability.controller.js";
import authenticate from "@common/middlewares/authenticate.js";
import requireRole from "@common/middlewares/requireRole.js";

const r = Router();

r.get('/', validate(availabilityQuerySchema), availabilityQueryController);

r.get('/blocked-slots', authenticate, requireRole(["ADMIN", "TUTOR"]), getBlockedSlotController);
r.post('/blocked-slots', authenticate, requireRole(["ADMIN"]), validate(createBlockedSlotSchema), createBlockedSlotController);
r.delete('/blocked-slots/:id', authenticate, requireRole(["ADMIN", "TUTOR"]), deleteBlockedSlotController);

r.get('/admin/working-hours', authenticate, requireRole(["ADMIN"]), getWorkingHoursController);
r.patch('/admin/working-hours', authenticate, requireRole(["ADMIN"]), validate(updateWorkingHoursSchema), updateWorkingHoursController);

export default r;