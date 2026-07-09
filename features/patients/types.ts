import { PatientFormValues, PatientDbRecord } from "./schema";

/**
 * Re-exports the inferred schema types to keep imports unified.
 */
export type { PatientFormValues, PatientDbRecord };

/**
 * Historical diagnostic visit profile logged for an individual patient.
 * Maps directly to rows rendered inside PatientHistoryList components.
 */
export interface PatientHistoryRecord {
  id: number;
  visit_date: string;
  test_name: string;
  status: "pending" | "sample_collected" | "completed" | string;
  billing_amount: number;
}

/**
 * Shape of the API response payload returned when fetching a patient's
 * complete medical profile summary.
 */
export interface PatientProfileDetails {
  info: PatientDbRecord;
  history: PatientHistoryRecord[];
}

/**
 * Type-safe definition for operational component search parameters.
 */
export interface PatientSearchFilters {
  query: string;
  gender?: "male" | "female" | "other" | "all";
}