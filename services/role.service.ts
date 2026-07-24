import { axiosInstance } from "@/config/axios";
import { CreateRoleRequest, CreateRoleResponse } from "@/types/role.types";

//obselete
export const roleService = {
  createRole: async (payload: CreateRoleRequest): Promise<CreateRoleResponse> => {
    const response = await axiosInstance.post<CreateRoleResponse>("/role/create", payload);
    return response.data;
  },
};


