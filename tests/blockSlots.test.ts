import { describe, it } from 'vitest';

import { getAllBlockedSlotsService, getDetailsBlockedSlotService, serviceAvailableSlots } from '../src/modules/availability/avavlability.service';

describe('getAllBlockedSlotsService', () => {
    it('should retrieve blocked slots successfully', async () => {
        const { data } = await getAllBlockedSlotsService();
        console.log({ data });
    });
});

describe('getDetailsBlockedSlotService', () => {
    it('should retrieve blocked slot details successfully', async () => {
        const date = process.env.TEST_DATE || '2026-05-20';
        const data = await getDetailsBlockedSlotService(new Date(date));
        console.log({ data });
    });
});

describe('getAvailableSlots', () => {
    it('get slots by specific date & tutorId', async () => {
        const serviceId = process.env.SERVICE_ID
        const tutorId = process.env.TUTOR_ID
        const date = process.env.DATE

        const { data } = await serviceAvailableSlots({ date, tutorId: Number(tutorId), serviceId })

        console.log({ data })
    })
})

