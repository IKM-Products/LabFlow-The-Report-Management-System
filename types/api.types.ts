// types/api.types.ts

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  result?: T;
}

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
  detail?: string;
  errors?: Record<string, string[] | string>;
}