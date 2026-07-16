export interface BaseApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface Profile {
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  phone: string;
  role_name: string;
  user_id: string;
}

export interface ProfileUpdateRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role_name: string;
}