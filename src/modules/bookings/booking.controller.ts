import handleRespone, { created } from "@common/utils/response.js";
import { createBookingService } from "./booking.service.js";


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

