import { z } from "zod";
import { ServiceLevel, ServiceMode } from "@config/db.js";

export const serviceBodySchema = z.object({
  code: z.string().min(3, "Code atleast 3 characters").toUpperCase().trim(),

  name: z.string().min(5, "Name is too short").trim(),

  subject: z.string().min(2, "Invalid subject").trim(),

  description: z.string().max(500).optional().nullable(),

  durationMinutes: z.number().int().positive().multipleOf(15),

  price: z.number().nonnegative("Price cannot be negative"),

  level: z.nativeEnum(ServiceLevel),

  mode: z.nativeEnum(ServiceMode),

  isActive: z.boolean().default(true),
});

export const createServiceSchema = z.object({ body: serviceBodySchema });

export const updateServiceSchema = z.object({
  body: serviceBodySchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
})

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;