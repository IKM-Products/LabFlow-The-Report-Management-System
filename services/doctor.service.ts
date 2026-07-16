import api from "@/config/axios";
import { 
  BaseApiResponse, 
  DoctorListItem, 
  DoctorDetailedData, 
  DoctorRequestPayload 
} from "@/types/doctor.types";

export const doctorService = {
  getAllDoctors: async (): Promise<DoctorListItem[]> => {
    const response = await api.get<BaseApiResponse<DoctorListItem[]>>("/doctor");
    return response.data.data;
  },

  getDoctorById: async (id: string): Promise<DoctorDetailedData> => {
    const response = await api.get<BaseApiResponse<DoctorDetailedData>>(`/doctor/${id}`);
    return response.data.data;
  },

  createDoctor: async (payload: DoctorRequestPayload): Promise<DoctorDetailedData> => {
    const response = await api.post<BaseApiResponse<DoctorDetailedData>>("/admin/doctor", payload);
    return response.data.data;
  },

  updateDoctor: async (id: string, payload: DoctorRequestPayload): Promise<string> => {
    const response = await api.patch<BaseApiResponse<string>>(`/admin/doctor/${id}`, payload);
    return response.data.data;
  },
};