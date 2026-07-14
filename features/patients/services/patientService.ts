import api from "@/axios/instance";
import { PatientFormValues } from "../schemas/patientSchema";

export interface PatientResponse {
  id: string; // UUID (e.g., 70377e33-d10d-4ed0-b939-a29f2a15f838)
  mrn: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: "M" | "F" | "O";
  phone: string;
  email: string;
  address: string;
  created_at?: string;
  updated_at?: string;
}

export const patientService = {
  /**
   * GET List Patients
   * GET -> {{base_url}}/patient
   */
  getPatients: async (search?: string): Promise<PatientResponse[]> => {
    const url = search ? `/patient?search=${encodeURIComponent(search)}` : "/patient";
    const response = await api.get<PatientResponse[]>(url);
    return response.data;
  },

  /**
   * GET Get Patient By ID
   * GET -> {{base_url}}/patient/:id
   */
  getPatientById: async (id: string): Promise<PatientResponse> => {
    const response = await api.get<PatientResponse>(`/patient/${id}`);
    return response.data;
  },

  /**
   * POST Create Patient
   * POST -> {{base_url}}/patient
   */
  createPatient: async (patientData: PatientFormValues): Promise<PatientResponse> => {
    const response = await api.post<PatientResponse>("/patient", patientData);
    return response.data;
  },

  /**
   * PATCH Update Patient
   * PATCH -> {{base_url}}/patient/:id
   */
  updatePatient: async (id: string, updatedData: Partial<PatientFormValues>): Promise<PatientResponse> => {
    const response = await api.patch<PatientResponse>(`/patient/${id}`, updatedData);
    return response.data;
  },
};