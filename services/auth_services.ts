import axiosInstance from "@/axios/instance";
import { AuthUser } from "@/types/auth_types";

export const get_user_service = async (): Promise<{
  success: boolean;
  message: string;
  data: AuthUser;
}> => {
  const response = await axiosInstance.get<{
    success: boolean;
    message: string;
    data: AuthUser;
  }>(`/users/me`);

  return response.data;
};