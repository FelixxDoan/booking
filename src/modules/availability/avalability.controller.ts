import handleRespone, { created, ok } from "@common/utils/response.js";
import {
    createBlockedSlotService,
    getAllBlockedSlotsService,
    getWorkingHoursService,
    updateWorkingHoursService,
    serviceAvailableSlots,
    tutorAvailableSlots
} from "./avavlability.service.js";

export const getWorkingHoursController = handleRespone(async (req, res) => {
    const { data, message } = await getWorkingHoursService();

    ok(res, data, message);
})

export const updateWorkingHoursController = handleRespone(async (req, res) => {
    const { workingHours } = req.body;

    const { data, message } = await updateWorkingHoursService(workingHours);

    created(res, data, message);
});

export const getBlockedSlotController = handleRespone(async (req, res) => {
    const { data, message } = await getAllBlockedSlotsService();
    ok(res, data, message);
});


export const createBlockedSlotController = handleRespone(async (req, res) => {
    const { startTime, endTime, reason, date, tutorId } = req.body;
    const createdBy = req.user.id;

    const { data, message } = await createBlockedSlotService({ startTime, endTime, reason, date, tutorId, createdBy });

    created(res, data, message);
});

export const availabilityQueryController = handleRespone(async (req, res) => {
    const { date, serviceId, tutorId } = req.query

    const { data, message } = await serviceAvailableSlots({ date, serviceId, tutorId })

    ok(res, data, message)
});

export const tutorAvailableController = handleRespone(async (req, res) => {
    const { subject } = req.query;

    const { data, message } = await tutorAvailableSlots(subject)

    ok(res, data, message)
});


export const deleteBlockedSlotController = handleRespone(async (req, res) => {
    // Implementation for deleting blocked slot controller
});

