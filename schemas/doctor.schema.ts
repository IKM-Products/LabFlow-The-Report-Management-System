import * as z from "zod";

export const doctorFormSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  first_name: z.string().min(2, "First name must contain at least 2 characters"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().min(7, "Phone number must contain at least 7 digits"),
  qualification: z.string().min(2, "Qualification details are required"),
  registration_no: z.string().min(2, "Registration number is required"),
});

export type DoctorFormValues = z.infer<typeof doctorFormSchema>;