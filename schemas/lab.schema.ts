import * as z from "zod";

export const labFormSchema = z.object({
  lab_name: z.string().min(2, "Lab name must contain at least 2 characters"),
  tagline: z.string().min(2, "Tagline must contain at least 2 characters"),
  address: z.string().min(3, "Address is required"),
  phone: z.string().min(10, "Phone number must contain at least 7 digits"),
  email: z.string().pipe(z.email("Please provide a valid email address")),
  registration_no: z.string().min(2, "Registration number is required"),
  report_footer: z.string().min(2, "Report footer content is required"),
});

export type LabFormValues = z.infer<typeof labFormSchema>;