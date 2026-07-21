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

  // GET {{base_url}}/admin/lab/all
  getAllLabs: async (): Promise<LabListItem[]> => {
    const response = await axiosInstance.get<BaseApiResponse<LabListItem[]>>("/admin/lab/all");
    return response.data.data;
  },

  // GET {{base_url}}/admin/lab/:id
  getAdminLabById: async (id: string): Promise<LabDetailedData> => {
    const response = await axiosInstance.get<BaseApiResponse<LabDetailedData>>(`/admin/lab/${id}`);
    return response.data.data;
  },

  // POST {{base_url}}/admin/lab
  createLab: async (payload: LabRequestPayload): Promise<LabDetailedData> => {
    const response = await axiosInstance.post<BaseApiResponse<LabDetailedData>>("/admin/lab", payload);
    return response.data.data;
  },

  // PATCH {{base_url}}/admin/lab-test/update-department?id=:id
  updateLab: async (id: string, payload: LabRequestPayload): Promise<string> => {
    const response = await axiosInstance.patch<BaseApiResponse<string>>(`/admin/lab-test/update-department`, payload, {
      params: { id }
    });
    return response.data.data;
  },
};