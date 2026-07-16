export interface BaseApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Maps response from GET {{base_url}}/admin/lab/all
export interface LabListItem {
  id: string;
  lab_name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  registration_no: string;
  report_footer: string;
  updated_by?: string;
}

// Maps response from single GET or POST responses
export interface LabDetailedData {
  id: string;
  labName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  registrationNo: string;
  reportFooter: string;
  updatedAt: string;
  updatedBy?: string;
}

// Standard payload interface for POST and PATCH operations
export interface LabRequestPayload {
  address: string;
  email: string;
  lab_name: string;
  phone: string;
  registration_no: string;
  report_footer: string;
  tagline: string;
}