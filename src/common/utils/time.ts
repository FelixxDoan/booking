import { Weekday } from "#generated/index.js";
import { getWorkingHoursForWeekday } from "@modules/availability/avavlability.service.js";
import type { Slot } from '@modules/availability/avavlability.service.js'
import throwErr from "./throwError.js";
import { detailService } from "@modules/services/service.repository.js";

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  ``
  return hours * 60 + minutes;
};

export const minutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const addMinutesToTime = (
  time: string,
  minutesToAdd: number
): string => {
  return minutesToTime(timeToMinutes(time) + minutesToAdd);
};

export const isOverlapTime = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  return timeToMinutes(start1) < timeToMinutes(end2)
    && timeToMinutes(end1) > timeToMinutes(start2);
};

export const combineDateAndTime = (date: string | Date, time: string): Date => {
  const dateOnly = typeof date === "string"
    ? date
    : date.toISOString().split("T")[0];

  return new Date(`${dateOnly}T${time}:00.000Z`);
};

const WeekDayMap: Weekday[] = ["SUNDAY"
  , "MONDAY"
  , "TUESDAY"
  , "WEDNESDAY"
  , "THURSDAY"
  , "FRIDAY"
  , "SATURDAY"]

export const getWeekdayEnumFromDate = (date: Date): Weekday => {

  return WeekDayMap[date.getDay()];
};

export const getListAvailableTimeSlots = async (
  date: Date,
  serviceId: string
) => {
  const weekday = getWeekdayEnumFromDate(date);
  const workingHours = await getWorkingHoursForWeekday(weekday);
  if (!workingHours) {
    return throwErr(404, "Working hours not found for the specified date");
  }

  if(!workingHours.isActive) {
    return []
  }

  const service = await detailService(serviceId);
  if (!service) {
    return throwErr(404, "Service not found");
  }

  const { durationMinutes } = service;

  const slots: Slot[] = [];
  let currentTime = timeToMinutes(workingHours.startTime);
  const endTimeInMinutes = timeToMinutes(workingHours.endTime);
  const intervalTime = 30

  while (currentTime + intervalTime <= endTimeInMinutes) {

    let endTimeForSlot = currentTime + durationMinutes;
    if (endTimeForSlot > endTimeInMinutes) {
      break;
    }
    const slot : Slot= {
      startTime: minutesToTime(currentTime),
      endTime: minutesToTime(endTimeForSlot),
    };
    slots.push(slot);
    currentTime += intervalTime;
  }

  return slots;
};