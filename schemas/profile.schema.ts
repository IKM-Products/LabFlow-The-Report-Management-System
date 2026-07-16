// schemas/profile.schema.ts

import { z } from "zod";

export const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Full name must contain at least 2 characters")
    .max(150, "Full name cannot exceed 150 characters"),

  phone: z
    .string()
    .trim()
    .max(20, "Phone cannot exceed 20 characters")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .max(150, "Email cannot exceed 150 characters")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<
  typeof profileSchema
>;