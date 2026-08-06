import { axiosInstance } from "@/config/axios";
import {
  LoginRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/types/auth.types";

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  forgotPassword: async (payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await axiosInstance.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      payload
    );
    return response.data;
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await axiosInstance.post<ResetPasswordResponse>(
      "/auth/reset-password",
      payload
    );
    return response.data;
  },
};