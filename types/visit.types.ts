// types/visit.types.ts

export interface CreateVisitRequest {
  doctor_id: string;
  patient_id: string;
  status: string;
  visit_no: string;
}

export interface CreateVisitResponseData {
  createdAt: string;
  doctorID: string;
  id: string;
  isDeleted: boolean;
  patientID: string;
  registeredBy: string;
  status: string;
  updatedAt: string;
  visitDate: string;
  visitNo: string;
}

export interface VisitListItem {
  doctor_name: string;
  patient_name: string;
  registered_by: string;
  status: string;
  visit_date: string;
  visit_id: string;
  visit_no: string;
}

export interface UpdateVisitRequest {
  doctor_id: string;
  id: string;
  is_deleted: boolean;
  patient_id: string;
  status: string;
  visit_no: string;
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

// Convenience type for GET /visit response
export type GetVisitsResponse = ApiResponse<VisitListItem[]>;