import { axiosInstance } from "@/config/axios";
import { 
  BaseApiResponse, 
  LabListItem, 
  LabDetailedData, 
  LabRequestPayload 
} from "@/types/lab.types";

export const labService = {
  // GET {{base_url}}/lab/get/{id}
  getLabById: async (id: string | number): Promise<LabListItem> => {
    const response = await axiosInstance.get<BaseApiResponse<LabListItem>>(`/lab/get/${id}`);
    return response.data.data;
  },

  // GET {{base_url}}/admin/lab
  getAllLabs: async (): Promise<LabListItem[]> => {
    const response = await axiosInstance.get<BaseApiResponse<LabListItem[]>>("/admin/lab");
    return response.data.data;
  },

  // POST {{base_url}}/admin/lab
  createLab: async (payload: LabRequestPayload): Promise<LabDetailedData> => {
    const response = await axiosInstance.post<BaseApiResponse<LabDetailedData>>("/admin/lab", payload);
    return response.data.data;
  },

  // PATCH {{base_url}}/admin/lab/{id}
  updateLab: async (id: string | number, payload: Partial<LabRequestPayload>): Promise<LabDetailedData> => {
    const response = await axiosInstance.patch<BaseApiResponse<LabDetailedData>>(`/admin/lab/${id}`, payload);
    return response.data.data;
  },
};