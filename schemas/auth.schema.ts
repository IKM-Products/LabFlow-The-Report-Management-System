// schemas/auth.schema.ts
import * as z from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email binding coordinate is required")
    .email("Invalid network email address format"),
  password: z
    .string()
    .min(6, "Cryptographic key authorization must contain at least 6 tokens"),
});