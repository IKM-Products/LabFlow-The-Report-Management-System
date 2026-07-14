// features/patients/schemas/patientSchema.ts
import { z } from 'zod';

export const patientFormSchema = z.object({
  mrn: z.string().min(1, 'Medical Record Number (MRN) is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  dob: z.string().min(1, 'Date of birth is required'), // HTML5 date input format: YYYY-MM-DD
  // Fixed error mapping structure to use the standard Zod message signature
  gender: z.enum(['M', 'F', 'O'], {
    message: 'Please select a gender configuration',
  }),
  phone: z.string().min(5, 'A valid contact phone number is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  address: z.string().min(1, 'Residential address is required'),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;