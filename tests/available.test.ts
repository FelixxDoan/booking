import { describe, it } from "vitest";

import { getDetailsBlockedSlotService, serviceAvailableSlots, getWorkingHoursService, updateWorkingHoursService } from "../src/modules/availability/avavlability.service.js";

describe("serviceAvailableSlots", () => {
  it('Get service available slots', async () => {
    const serviceId = process.env.SERVICE_ID || "";
    const date = process.env.DATE || "";
    const tutorId = process.env.TUTOR_ID || "";

    const { data } = await serviceAvailableSlots({ serviceId, date, tutorId });

    console.log({ data });
  });
});

describe("getBlockByDate", () => {
  it('Get blocked slots by date', async () => {
    const date = process.env.DATE ;
    console.log({ date });

    const  data  = await getDetailsBlockedSlotService(date);

    console.log({ data });
  });
});

describe('getWorkingHours', () => {
  it('Get working hours', async () => {
    const {data} = await getWorkingHoursService() 
    console.log({data})
  })
})
