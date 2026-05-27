// src/modules/availability/availability.validation.ts
import { z } from "zod";
 
import { Weekday } from '@config/db.js';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const isValidDateOnly = (value: string) => {
  if (!dateRegex.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const dateOnlySchema = z
  .string()
  .refine(isValidDateOnly, {
    message: "date must be a valid date in YYYY-MM-DD format",
  });

export const timeSchema = z
  .string()
  .regex(timeRegex, "time must be in HH:mm format");

export const availabilityQuerySchema = z.object({
  query: z.object({
    date: dateOnlySchema,
    serviceId: z.string().uuid("serviceId must be a valid UUID"),
    tutorId: z
    .string()
      .optional(),
  }),
});

export const createBlockedSlotSchema = z.object({
  body: z
    .object({
      tutorId: z
        .number()
        .int("tutorId must be an integer")
        .positive("tutorId must be positive")
        .optional(),

      date: dateOnlySchema,

      startTime: timeSchema.optional(),
      endTime: timeSchema.optional(),

      reason: z
        .string()
        .trim()
        .max(255, "reason must be at most 255 characters")
        .optional(),
    })
    .superRefine((data, ctx) => {
      const hasStart = Boolean(data.startTime);
      const hasEnd = Boolean(data.endTime);

      if (hasStart !== hasEnd) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "startTime and endTime must be provided together",
          path: ["startTime"],
        });
        return;
      }

      if (data.startTime && data.endTime) {
        if (timeToMinutes(data.startTime) >= timeToMinutes(data.endTime)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "startTime must be before endTime",
            path: ["startTime"],
          });
        }
      }
    }),
});

export const updateWorkingHoursSchema = z.object({
  body: z.object({
    workingHours: z
      .array(
        z
          .object({
            weekday: z.nativeEnum(Weekday),
            startTime: timeSchema,
            endTime: timeSchema,
            timezone: z.string().trim().min(1).default("Asia/Ho_Chi_Minh"),
            isActive: z.boolean().optional(),
          })
          .superRefine((data, ctx) => {
            if (timeToMinutes(data.startTime) >= timeToMinutes(data.endTime)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "startTime must be before endTime",
                path: ["startTime"],
              });
            }
          })
      )
      .min(1, "items must contain at least one working hour rule"),
  }),
});