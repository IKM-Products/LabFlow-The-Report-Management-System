import { axiosInstance } from "@/config/axios";
import { CreateUserRequest, CreateUserResponse } from "@/types/user.types";

export const userService = {
  createUser: async (payload: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await axiosInstance.post<CreateUserResponse>("/special/user/create", payload);
    return response.data;
  },
};