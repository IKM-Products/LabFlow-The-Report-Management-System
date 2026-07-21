export interface ReferenceRangePayload {
  gender: string;
  id: string;
  max_age: number;
  max_value: number;
  min_age: number;
  min_value: number;
  note: string;
  parameter_id: string;
  text_range: string;
}

export interface ReferenceRangeItem {
  age: string;
  gender: string;
  note: string;
  parameter_id: string;
  ref_id: string;
  text_range: string;
  value: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  messages?: string[];
  data?: T;
}