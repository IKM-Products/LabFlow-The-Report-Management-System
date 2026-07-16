// schemas/patient.schema.ts
import { z } from "zod";

export const patientSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender selection is required"),
  address: z.string().min(1, "Address is required"),
  mrn: z.string().min(1, "MRN identification is required"),
});

export type PatientFormValues = z.infer<typeof patientSchema>;