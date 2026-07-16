// types/result.types.ts

export interface ResultItem {
  flag: string;
  id: string;
  order_id: string;
  parameter_id: string;
  performed_at: string;
  performed_by: string;
  remarks: string;
  result_value: string;
  verified_by: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiErrorResponse {
  messages: string[];
  success: boolean;
}