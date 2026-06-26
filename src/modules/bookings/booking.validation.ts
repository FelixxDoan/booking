import { z } from "zod";
import { BookingSource, BookingStatus } from "#generated/client.js";
import { dateOnlySchema, timeSchema } from "@modules/availability/availability.validation.js";

const optionalStringSchema = z
  .string()
  .trim()
  .min(1, "Value cannot be empty")
  .optional();

const idParamSchema = z.object({
  id: z.string().uuid("Invalid booking id"),
});

export const createBookingSchema = z.object({
  body: z
    .object({
      tutorId: z.number().int().positive().optional(),
      bookingDate: dateOnlySchema,
      startTime: timeSchema,
      endTime: timeSchema,
      studentNote: z.string().trim().max(500).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.startTime >= data.endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endTime"],
          message: "endTime must be after startTime",
        });
      }
    }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>["body"]

export const getBookingDetailSchema = z.object({
  params: idParamSchema,
});

export const cancelBookingSchema = z.object({
  params: idParamSchema,
  body: z.object({
    cancelReason: z
      .string()
      .trim()
      .min(1, "cancelReason is required")
      .max(500, "cancelReason must be at most 500 characters"),
  }),
});

export const rescheduleInputSchema = z.object({
  newBookingDate: dateOnlySchema,
  newStartTime: timeSchema,
  newEndTime: timeSchema,
});

export const rescheduleBookingSchema = z.object({
  params: idParamSchema,

  body: z.object({
    rescheduleInput: rescheduleInputSchema,
  }).superRefine((data, ctx) => {
    const { newStartTime, newEndTime } = data.rescheduleInput;

    if (newStartTime >= newEndTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rescheduleInput", "newEndTime"],
        message: "endTime must be after startTime",
      });
    }
  }),
});

export type RescheduleInput = z.infer<typeof rescheduleInputSchema>;

export const assignTutorSchema = z.object({
  params: idParamSchema,
  body: z.object({
    tutorId: z.number().int().positive("Invalid tutor id"),
    internalNote: z.string().trim().max(500).optional(),
  }),
});

export const updateBookingStatusSchema = z.object({
  params: idParamSchema,
  body: z.object({
    status: z.nativeEnum(BookingStatus),
    internalNote: z.string().trim().max(500).optional(),
  }),
});

export const updateBookingInternalNoteSchema = z.object({
  params: idParamSchema,
  body: z.object({
    internalNote: z
      .string()
      .trim()
      .min(1, "internalNote is required")
      .max(1000, "internalNote must be at most 1000 characters"),
  }),
});

export const listBookingsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),

    bookingDate: dateOnlySchema.optional(),
    fromDate: dateOnlySchema.optional(),
    toDate: dateOnlySchema.optional(),

    studentId: z.coerce.number().int().positive().optional(),
    tutorId: z.coerce.number().int().positive().optional(),
    serviceId: z.string().uuid().optional(),

    status: z.nativeEnum(BookingStatus).optional(),
    source: z.nativeEnum(BookingSource).optional(),
  }),
});