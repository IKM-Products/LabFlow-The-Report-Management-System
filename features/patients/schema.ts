import * as zod from "zod";

/**
 * Client-facing Form Validation Schema managed via react-hook-form.
 * Enforces field data types before making API calls.
 */
export const patientFormSchema = zod.object({
  full_name: zod
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Name string exceeds clinical bounds"),
  age: zod.coerce
    .number()
    .min(1, "Age must be greater than 0")
    .max(125, "Age parameter exceeds historical human lifecycle records"),
  gender: zod.enum(["male", "female", "other"] as const, {
    message: "Please select a target gender classification",
  }),
  phone: zod
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone identifier exceeds international format allocations")
    .regex(/^[0-9+\-\s]+$/, "Phone track contains illegal character entities"),
});

/**
 * Strict database context contract mirroring row properties.
 */
export const patientDbSchema = patientFormSchema.extend({
  id: zod.number(),
  test_id: zod.string(), // The systemic unique ID displayed on barcoded labels
  created_at: zod.string().datetime(),
  updated_at: zod.string().datetime().optional(),
});

// Structural TypeScript type layout mappings
export type PatientFormValues = zod.infer<typeof patientFormSchema>;
export type PatientDbRecord = zod.infer<typeof patientDbSchema>;