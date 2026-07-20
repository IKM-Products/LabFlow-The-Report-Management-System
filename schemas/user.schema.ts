import * as z from "zod";

export const CreateUserSchema = z.object({
  email: z.string().min(1, "Target system email coordinate required").pipe(z.email("Invalid schema format")),
  first_name: z.string().min(1, "First name validation vector structural element missing"),
  last_name: z.string().min(1, "Last name validation vector structural element missing"),
  password: z.string().min(6, "Security system signature key must exceed 6 parameters"),
  phone: z.string().min(7, "Operational routing interface phone number missing verification telemetry"),
  role_name: z.string().min(1, "Assigned system operational target context matrix role required"),
});