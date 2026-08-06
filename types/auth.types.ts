export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthData {
  access_token: string;
  session_id: string;
  user_id: string;
  user_type: string;
}

export interface AuthResponse {
  data: AuthData;
  message: string;
  success: boolean;
}

export interface ApiErrorResponse {
  messages: string[];
  success: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordData {
  expires_at: string;
  otp: string;
  reset_url: string;
}

export interface ForgotPasswordResponse {
  data: ForgotPasswordData;
  message: string;
  success: boolean;
}

export interface ResetPasswordRequest {
  email: string;
  new_password: string;
  otp: string;
}

export interface ResetPasswordResponse {
  data: string;
  message: string;
  success: boolean;
}