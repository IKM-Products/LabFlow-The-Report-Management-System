import { z } from "zod";

// --- Login Schema ---
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// --- Signup Schema ---
export const signupSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "First name is required"),
    
  last_name: z
    .string()
    .trim()
    .min(2, "Last name is required"),
    
  email: z
    .string()
    .trim()
    .email("Invalid email address"),
    
  phone: z
    .string()
    .trim()
    .min(7, "Invalid phone number"),
    
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
    
  role_name: z
    .enum(["ROLE_ADMIN", "ROLE_TECHNICIAN"]),
});

export type SignupFormValues = z.infer<typeof signupSchema>;