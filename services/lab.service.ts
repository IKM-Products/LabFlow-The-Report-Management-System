import api from "@/config/axios";
import { 
  BaseApiResponse, 
  LabListItem, 
  LabDetailedData, 
  LabRequestPayload 
} from "@/types/lab.types";

export const labService = {
  // GET {{base_url}}/admin/lab/all
  getAllLabs: async (): Promise<LabListItem[]> => {
    const response = await api.get<BaseApiResponse<LabListItem[]>>("/admin/lab/all");
    return response.data.data;
  },

  // GET {{base_url}}/admin/lab/:id
  getLabById: async (id: string): Promise<LabDetailedData> => {
    const response = await api.get<BaseApiResponse<LabDetailedData>>(`/admin/lab/${id}`);
    return response.data.data;
  },

  // POST {{base_url}}/admin/lab
  createLab: async (payload: LabRequestPayload): Promise<LabDetailedData> => {
    const response = await api.post<BaseApiResponse<LabDetailedData>>("/admin/lab", payload);
    return response.data.data;
  },

  // PATCH {{base_url}}/admin/lab-test/update-department?id=:id (or matching your endpoint format)
  updateLab: async (id: string, payload: LabRequestPayload): Promise<string> => {
    // Passes the ID context as a parameter matching standard edit inputs
    const response = await api.patch<BaseApiResponse<string>>(`/admin/lab-test/update-department`, payload, {
      params: { id }
    });
    return response.data.data;
  },
};