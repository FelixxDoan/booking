import { BookingStatus } from "#generated/index.js";
import { OldBooking } from "./booking.validation.js";

export const bookingStatusesConsumeTime: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.IN_PROGRESS,
];

export const bookingStatusesUnconsumeTime: BookingStatus[] = [
  BookingStatus.CANCELLED,
  BookingStatus.COMPLETED,
  BookingStatus.NO_SHOW,
];

const isTooClose = ({ startTime, bookingDate }: { startTime: string, bookingDate: Date }) => {
  const bookingStart = new Date(`${bookingDate}-T-${startTime}`)
  const currDate = new Date()

  const diffMs = bookingStart.getTime() - currDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 2) return false

  return true
}

export const cancellableStatuses: BookingStatus[] = ["PENDING", "CONFIRMED"];

export const canReschedule = ({ status, startTime, bookingDate }: { status: BookingStatus, startTime: string, bookingDate: Date }) => {

  if (status !== "CONFIRMED") return false

  if (!isTooClose({ startTime, bookingDate })) return false

  return true

}
