import authenticate from '@common/middlewares/authenticate.js'
import { validate } from '@common/middlewares/validate.js'
import {Router} from 'express'
import { createBookingSchema } from './booking.validation.js'
import { createBookingController } from './booking.controller.js'

const r = Router()

r.post('/:id', authenticate, validate(createBookingSchema), createBookingController)

export default r