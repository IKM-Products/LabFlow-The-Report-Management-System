// types/report.types.ts
export interface Report {
  id: string;
  report_no: string;
  visit_id: string;
  pdf_path: string;
  status: string;
  generated_at: string;
  generated_by: string;
}

export interface PrintLog {
  id: string;
  report_id: string;
  copy_number: number;
  printed_at: string;
  printed_by: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}