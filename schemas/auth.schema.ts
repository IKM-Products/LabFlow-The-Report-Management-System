import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .pipe(z.email("Please enter a valid email address.")),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long."),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .pipe(z.email("Please enter a valid email address.")),
});

export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .pipe(z.email("Please enter a valid email address.")),

  otp: z
    .string()
    .trim()
    .min(1, "OTP is required."),

  new_password: z
    .string()
    .min(8, "Password must be at least 8 characters long."),
});

export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;