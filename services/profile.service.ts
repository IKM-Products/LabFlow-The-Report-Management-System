import { axiosInstance } from "@/config/axios";
import { BaseApiResponse, Profile, ProfileUpdateRequest } from "@/types/profile.types";

export const profileService = {
  // GET {{base_url}}/profile/getme
  getMe: async (): Promise<Profile> => {
    const response = await axiosInstance.get<BaseApiResponse<Profile>>("/profile/getme");
    return response.data.data;
  },

  // GET {{base_url}}/profile
  getProfiles: async (): Promise<Profile[]> => {
    const response = await axiosInstance.get<BaseApiResponse<Profile[]>>("/profile");
    return response.data.data;
  },

  // PATCH {{base_url}}/profile/update-profile/{id}
  updateProfile: async (id: string, payload: ProfileUpdateRequest): Promise<string> => {
    const response = await axiosInstance.patch<BaseApiResponse<string>>(`/profile/update-profile/${id}`, payload);
    return response.data.data;
  },
};