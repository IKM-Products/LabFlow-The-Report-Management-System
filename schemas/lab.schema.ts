// src/schemas/lab.schema.ts

import { z } from "zod";

const optionalText = (maxLength: number, message: string) =>
  z
    .string()
    .trim()
    .max(maxLength, message)
    .optional()
    .or(z.literal(""));

export const labSchema = z.object({
  lab_name: z
    .string()
    .trim()
    .min(2, "Lab name must contain at least 2 characters")
    .max(150, "Lab name cannot exceed 150 characters"),

  tagline: optionalText(
    255,
    "Tagline cannot exceed 255 characters",
  ),

  address: optionalText(
    255,
    "Address cannot exceed 255 characters",
  ),

  phone: optionalText(
    20,
    "Phone number cannot exceed 20 characters",
  ),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(150, "Email cannot exceed 150 characters")
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .trim()
    .url("Enter a valid website URL")
    .max(150, "Website cannot exceed 150 characters")
    .optional()
    .or(z.literal("")),

  logo_path: optionalText(
    255,
    "Logo path cannot exceed 255 characters",
  ),

  registration_no: optionalText(
    50,
    "Registration number cannot exceed 50 characters",
  ),

  report_footer: z
    .string()
    .trim()
    .max(1000, "Report footer cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type LabFormValues = z.infer<typeof labSchema>;