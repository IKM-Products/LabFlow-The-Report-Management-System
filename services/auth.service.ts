// src/services/auth.service.ts

import { publicApi } from "@/config/axios";

import type {
  CreateRolePayload,
  SignupPayload,
  LoginPayload,
  LoginResponse,
  ProfileResponse,
} from "@/types/auth.types";

/* -------------------------------------------------------------------------- */
/*                                CREATE ROLE                                 */
/* -------------------------------------------------------------------------- */

export async function createRole(data: CreateRolePayload) {
  const response = await publicApi.post("/role/create", data);

  return response.data;
}

/* -------------------------------------------------------------------------- */
/*                                CREATE USER                                 */
/* -------------------------------------------------------------------------- */

export async function signup(data: SignupPayload) {
  const response = await publicApi.post("/admin/user/create", data);

  return response.data;
}

/* -------------------------------------------------------------------------- */
/*                                   LOGIN                                    */
/* -------------------------------------------------------------------------- */

export async function login(
  data: LoginPayload
): Promise<LoginResponse> {
  const response = await publicApi.post<LoginResponse>(
    "/auth/login",
    data
  );

  return response.data;
}

/* -------------------------------------------------------------------------- */
/*                                  GET ME                                    */
/* -------------------------------------------------------------------------- */

export async function getMe(
  accessToken: string
): Promise<ProfileResponse> {
  const response = await publicApi.get<{
    success: boolean;
    message: string;
    data: ProfileResponse;
  }>("/profile/getme", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data.data;
}