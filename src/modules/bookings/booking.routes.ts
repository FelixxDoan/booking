import authenticate from '@common/middlewares/authenticate.js'
import { validate } from '@common/middlewares/validate.js'
import { Router } from 'express'
import { cancelBookingSchema, createBookingSchema, rescheduleBookingSchema } from './booking.validation.js'
import { 
    createBookingController, 
    getBookingsByRoleController, 
    cancelBookingController,
    getDetailsBookingController,
    rescheduleBookingController
 } from './booking.controller.js'
import requireRole from '@common/middlewares/requireRole.js'

const r = Router()

r.post('/:id', authenticate, validate(createBookingSchema), createBookingController)

r.get("/my-bookings", authenticate, requireRole(["STUDENT", "TUTOR"]), getBookingsByRoleController)

r.get('/:id', authenticate, requireRole(["STUDENT", "TUTOR"]), getDetailsBookingController)

r.patch("/:id/cancel", authenticate, requireRole(["STUDENT", "TUTOR"]), validate(cancelBookingSchema),cancelBookingController)
r.patch("/:id/reschedule", authenticate, requireRole(["STUDENT"]), validate(rescheduleBookingSchema),rescheduleBookingController)




export default r