export interface BaseApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface Department {
  dept_id: string;
  dept_name: string;
  dept_description: string;
}

export interface DepartmentCreateResponse {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
}

export interface DepartmentRequestPayload {
  id?: string; // Optional for new, required for update mapping
  dept_name: string;
  dept_description: string;
}