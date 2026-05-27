import { BookingStatus } from "#generated/index.js";

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