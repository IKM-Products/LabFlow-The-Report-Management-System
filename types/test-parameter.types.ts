export interface TestParameterPayload {
  id: string;
  parameter_name: string;
  result_type: string;
  sequence_no: number;
  test_id: string;
  unit: string;
}

export interface TestParameterItem {
  parameter_id: string;
  parameter_name: string;
  result_type: string;
  sequence_no: number;
  test_id: string;
  unit: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  messages?: string[];
  data?: T;
}