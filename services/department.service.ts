import { axiosInstance } from "@/config/axios";
import { 
  BaseApiResponse, 
  Department, 
  DepartmentCreateResponse, 
  DepartmentRequestPayload 
} from "@/types/department.types";

export const departmentService = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await axiosInstance.get<BaseApiResponse<Department[]>>("/lab-test/list-department");
    return response.data.data;
  },

  createDepartment: async (payload: DepartmentRequestPayload): Promise<DepartmentCreateResponse> => {
    const response = await axiosInstance.post<BaseApiResponse<DepartmentCreateResponse>>("/admin/lab-test/create-department", payload);
    return response.data.data;
  },

  updateDepartment: async (payload: DepartmentRequestPayload): Promise<string> => {
    const response = await axiosInstance.patch<BaseApiResponse<string>>("/admin/lab-test/update-department", payload);
    return response.data.data;
  },
};