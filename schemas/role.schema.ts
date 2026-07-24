import * as z from "zod";

//obselete
export const RoleSchema = z.object({
  role_name: z
    .string()
    .min(2, "Matrix authorization role identifier must exceed 2 characters")
    .max(50, "Identifier key limit exceeded"),
});