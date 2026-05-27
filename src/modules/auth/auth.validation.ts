import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string({
        required_error: "Full name is required",
        invalid_type_error: "Full name must be a string",
      })
      .trim()
      .min(1, "Full name is required")
      .max(100, "Full name must be at most 100 characters"),

    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .trim()
      .toLowerCase()
      .email("Invalid email format")
      .max(255, "Email must be at most 255 characters"),

    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters"),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .trim()
      .toLowerCase()
      .email("Invalid email format")
      .max(255, "Email must be at most 255 characters"),

    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters"),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>["body"];

export const teachingModeSchema = z.enum(["ONLINE", "OFFLINE", "HYBRID"]);

export const tutorProfileBodySchema = z.object({
  headline: z.string().trim().min(2).max(120).optional(),

  bio: z.string().trim().min(10).max(1000).optional(),

  subjects: z
    .array(z.string().trim().min(1))
    .min(1, "At least one subject is required")
    .optional(),

  yearsOfExperience: z
    .number()
    .int()
    .min(0)
    .max(50)
    .optional(),

  teachingModes: z
    .array(teachingModeSchema)
    .min(1, "At least one teaching mode is required")
    .optional(),

  isActive: z.boolean().optional(),
});


export const createTutorProfileSchema = z.object({
  body: tutorProfileBodySchema.extend({
    subjects: z
      .array(z.string().trim().min(1))
      .min(1, "At least one subject is required"),

    teachingModes: z
      .array(teachingModeSchema)
      .min(1, "At least one teaching mode is required"),
  }),
});

export type tutorProfileInput = z.infer<typeof createTutorProfileSchema>["body"]


export const updateTutorProfileSchema = z.object({
  body: tutorProfileBodySchema.refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided for update",
    }
  ),
});