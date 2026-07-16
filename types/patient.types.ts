// types/patient.types.ts
export interface Patient {
  id: string;
  mrn: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
}

export interface PatientResponse<T> {
  data: T;
  message: string;
  success: boolean;
}