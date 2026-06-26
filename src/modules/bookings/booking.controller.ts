import handleRespone, { created, ok } from "@common/utils/response.js";
import {
    createBookingService,
    getBookingsByRoleService,
    cancelBookingService,
    getDetailsBookingService,
    reScheduleBookingService
} from "./booking.service.js";

export const createBookingController = handleRespone(async (req, res) => {

    const { serviceId
        , tutorId
        , bookingDate
        , startTime
        , endTime
        , studentNote } = req.body
    const { id: studentId } = req.user
    const { id: serviceCode } = req.params

    const { data, message } = await createBookingService({
        serviceId
        , tutorId
        , bookingDate
        , startTime
        , endTime
        , studentNote
    }, studentId, serviceCode)

    created(res, data, message)
})

export const getBookingsByRoleController = handleRespone(async (req, res) => {
    const { id, role } = req.user
    const userId = Number(id)

    const { data, message } = await getBookingsByRoleService({ role, userId })

    ok(res, data, message)
})

export const cancelBookingController = handleRespone(async (req, res) => {
    const { id: bookingId } = req.params

    const { id } = req.user
    const userId = Number(id)

    const { cancelReason } = req.body

    const { data, message } = await cancelBookingService({ userId, bookingId, cancelReason })

    ok(res, data, message)
})

export const getDetailsBookingController = handleRespone(async (req, res) => {
    const { id: bookingId } = req.params

    const { id, role } = req.user

    const userId = Number(id)
    console.log({ userId, role })


    const { data, message } = await getDetailsBookingService({ userId, role, bookingId })

    ok(res, data, message)
})

export const rescheduleBookingController = handleRespone(async (req, res) => {
    const { id: bookingId } = req.params

    const { rescheduleInput } = req.body

    const { data, message } = await reScheduleBookingService({ bookingId, rescheduleInput })
   
    ok(res, data, message)
})
