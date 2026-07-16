import { CreateUserSchema } from "@/schemas/user.schema";
import * as z from "zod";

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;

export interface CreateUserResponse {
  data: string;
  message: string;
  success: boolean;
}