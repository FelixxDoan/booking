import { describe, it, expect } from "vitest";
import { getWorkingHoursForWeekday } from "../src/modules/availability/avavlability.service";
import { getListAvailableTimeSlots, getWeekdayEnumFromDate } from "../src/common/utils/time.js";
import { getDetailService, getAllAdminServices } from "../src/modules/services/service.service.js";
import { getAllTurors, getTutorById, getTutorBySubject } from '../src/modules/tutor/tutor.repository.js'

describe("getWorkingHoursForWeekday", () => {
  it('Get working hours ', async () => {

    const date = new Date();
    const weekday = getWeekdayEnumFromDate(date);
    const workingHours = await getWorkingHoursForWeekday(weekday);

    console.log({ workingHours });
  });
});

describe("getWeekdayEnumFromDate", () => {
  it('Get weekday enum from date', () => {
    const date = new Date("2024-06-10");
    const weekdayEnum = getWeekdayEnumFromDate(date);

    console.log({ weekdayEnum });
  });
});

describe("getAllServices", () => {
  it('Get all services', async () => {
    const { data } = await getAllAdminServices();
    console.log({ data });
  });
});

describe("getDetailServices", () => {
  it('Get detail services', async () => {
    const id = process.env.ID || "";
    const { data } = await getDetailService(id);
    console.log({ data });
  });
});

describe("getListAvailableTimeSlots", () => {
  it('Get list available time slots', async () => {
    const date = "2026-05-22";
    const startTime = "08:30";
    const endTime = "16:00";
    const durationMinutes = 120;

    const availableTimeSlots = getListAvailableTimeSlots(date, startTime, endTime, durationMinutes);

    console.log({ availableTimeSlots });
  });
});

describe('getAllTutors', () => {
  it('get all tutors', async () => {
    const data = await getAllTurors()
    console.log({data})
  })
})

describe('getDetailsTutor', () => {
  it('get details tutor', async () => {
    const id = process.env.ID
    const data = await getTutorById(Number(id))
    console.log({data})
  })
})

describe('getTutorBySubject', () => {
  it('get tutor by subject', async () => {
    const subject = process.env.SUBJECT || ""
    const data = await getTutorBySubject(subject)
    console.log({data})
  })
})