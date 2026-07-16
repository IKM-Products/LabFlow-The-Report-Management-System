import { axiosInstance } from "@/config/axios";
import { LoginRequest, AuthResponse } from "@/types/auth.types";

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },
};