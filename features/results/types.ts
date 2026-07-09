export interface ParameterResult {
  parameter_id: number;
  name: string;
  value: string;
  unit: string;
  reference_range: string;
  is_abnormal: boolean;
  is_critical: boolean;
}

export interface OrderResultProfile {
  order_id: number;
  patient_name: string;
  test_name: string;
  status: string;
  parameters: ParameterResult[];
}

export interface SingleResultInput {
  parameter_id: number;
  value: string;
}

export interface OrderResultsSubmission {
  order_id: number;
  results: SingleResultInput[];
}