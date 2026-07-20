// schemas/auth.schema.ts
import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .pipe(z.email("Please enter a valid email address.")),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long."),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;