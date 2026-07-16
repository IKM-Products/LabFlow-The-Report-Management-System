import api from "@/config/axios";
import { 
  BaseApiResponse, 
  Department, 
  DepartmentCreateResponse, 
  DepartmentRequestPayload 
} from "@/types/department.types";

export const departmentService = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await api.get<BaseApiResponse<Department[]>>("/lab-test/list-department");
    return response.data.data;
  },

  createDepartment: async (payload: DepartmentRequestPayload): Promise<DepartmentCreateResponse> => {
    const response = await api.post<BaseApiResponse<DepartmentCreateResponse>>("/admin/lab-test/create-department", payload);
    return response.data.data;
  },

  updateDepartment: async (payload: DepartmentRequestPayload): Promise<string> => {
    const response = await api.patch<BaseApiResponse<string>>("/admin/lab-test/update-department", payload);
    return response.data.data;
  },
};