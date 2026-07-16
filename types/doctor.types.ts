export interface BaseApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface DoctorListItem {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  qualification: string;
  registration_no: string;
}

export interface DoctorDetailedData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  qualification: string;
  registrationNo: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
}

export interface DoctorRequestPayload {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  qualification: string;
  registration_no: string;
}