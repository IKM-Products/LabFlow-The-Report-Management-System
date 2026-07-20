import { axiosInstance } from "@/config/axios";
import { 
  BaseApiResponse, 
  DoctorListItem, 
  DoctorDetailedData, 
  DoctorRequestPayload 
} from "@/types/doctor.types";

export const doctorService = {
  getAllDoctors: async (): Promise<DoctorListItem[]> => {
    const response = await axiosInstance.get<BaseApiResponse<DoctorListItem[]>>("/doctor");
    return response.data.data;
  },

  getDoctorById: async (id: string): Promise<DoctorDetailedData> => {
    const response = await axiosInstance.get<BaseApiResponse<DoctorDetailedData>>(`/doctor/${id}`);
    return response.data.data;
  },

  createDoctor: async (payload: DoctorRequestPayload): Promise<DoctorDetailedData> => {
    const response = await axiosInstance.post<BaseApiResponse<DoctorDetailedData>>("/admin/doctor", payload);
    return response.data.data;
  },

  updateDoctor: async (id: string, payload: DoctorRequestPayload): Promise<string> => {
    const response = await axiosInstance.patch<BaseApiResponse<string>>(`/admin/doctor/${id}`, payload);
    return response.data.data;
  },
};