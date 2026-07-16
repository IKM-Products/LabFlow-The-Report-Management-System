// schemas/visit.schema.ts

import { z } from "zod";

export const createVisitSchema = z.object({
  doctor_id: z.string().min(1, "Doctor selection reference identifier is required"),
  patient_id: z.string().min(1, "Patient tracking reference index is required"),
  status: z.string().min(1, "Current visit initialization status is required"),
  visit_no: z.string().min(1, "Unique programmatic encounter number is required"),
});

export const editVisitSchema = z.object({
  doctor_id: z.string().min(1, "Doctor selection reference identifier is required"),
  id: z.string().min(1, "Visit primary reference key target is required"),
  is_deleted: z.boolean().default(false),
  patient_id: z.string().min(1, "Patient tracking reference index is required"),
  status: z.string().min(1, "Modified encounter tracking state configuration required"),
  visit_no: z.string().min(1, "Unique programmatic encounter number is required"),
});

export type CreateVisitFormValues = z.infer<typeof createVisitSchema>;
export type EditVisitFormValues = z.infer<typeof editVisitSchema>;