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