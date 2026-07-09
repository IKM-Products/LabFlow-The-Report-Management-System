import { ResultEntryFormValues, ParameterResultValues } from "../schema";

export type { ResultEntryFormValues, ParameterResultValues };

export interface ParameterDefinition {
  id: number;
  name: string;
  unit: string;
  reference_range: string;
  display_order: number;
}

export interface OrderResultDetail {
  order_id: number;
  patient_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  test_name: string;
  specimen_type: string;
  referred_by: string;
  ordered_at: string;
  parameters: ParameterDefinition[];
}