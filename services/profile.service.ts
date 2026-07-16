// src/services/profile.service.ts

import axiosInstance from "@/config/axios";
import {
  Profile,
  UpdateProfilePayload,
} from "@/types/profile.types";

/* -------------------------------------------------------------------------- */
/*                                   GET ME                                   */
/* -------------------------------------------------------------------------- */

export async function getMe(): Promise<Profile> {
  const response = await axiosInstance.get("/profile/getme");

  return response.data.data;
}

/* -------------------------------------------------------------------------- */
/*                               GET PROFILES                                 */
/* -------------------------------------------------------------------------- */

export async function getProfiles(): Promise<Profile[]> {
  const response = await axiosInstance.get(
    "/admin/profile/profile-details"
  );

  return response.data.data;
}

/* -------------------------------------------------------------------------- */
/*                              UPDATE PROFILE                                */
/* -------------------------------------------------------------------------- */

export async function updateProfile(
  id: string,
  data: UpdateProfilePayload
): Promise<Profile> {
  const response = await axiosInstance.patch(
    `/profile/update-profile/${id}`,
    data
  );

  return response.data.data;
}