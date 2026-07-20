// services/patient.service.ts
import { axiosInstance } from "@/config/axios";
import { Patient, PatientResponse } from "@/types/patient.types";
import { PatientFormValues } from "@/schemas/patient.schema";

export const patientService = {
  getPatients: async (): Promise<PatientResponse<Patient[]>> => {
    const response = await axiosInstance.get<PatientResponse<Patient[]>>("/patient");
    return response.data;
  },

  getPatientById: async (id: string): Promise<PatientResponse<Patient>> => {
    const response = await axiosInstance.get<PatientResponse<Patient>>(`/patient/${id}`);
    return response.data;
  },

  createPatient: async (data: PatientFormValues): Promise<PatientResponse<any>> => {
    const response = await axiosInstance.post<PatientResponse<any>>("/patient", data);
    return response.data;
  },

  updatePatient: async (id: string, data: PatientFormValues): Promise<PatientResponse<string>> => {
    const response = await axiosInstance.patch<PatientResponse<string>>(`/patient/${id}`, data);
    return response.data;
  },
};