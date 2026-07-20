import * as z from "zod";

export const profileFormSchema = z.object({
  first_name: z.string().min(2, "First name must contain at least 2 characters"),
  last_name: z.string().min(2, "Last name must contain at least 2 characters"),
  email: z.string().pipe(z.email("Please provide a valid email address")),
  phone: z.string().min(7, "Phone number must contain at least 7 digits"),
  role_name: z.string().min(2, "Role designation title is required"),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;