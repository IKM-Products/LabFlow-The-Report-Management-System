// services/result.service.ts

import { axiosInstance } from "@/config/axios";
import { ResultItem, ApiResponse } from "@/types/result.types";
import { CreateResultFormValues, EditResultFormValues } from "@/schemas/result.schema";

export const resultService = {
  createResult: async (payload: CreateResultFormValues): Promise<ApiResponse<ResultItem[]>> => {
    const response = await axiosInstance.post<ApiResponse<ResultItem[]>>("/result", payload);
    return response.data;
  },

  getResultById: async (id: string): Promise<ApiResponse<ResultItem>> => {
    const response = await axiosInstance.get<ApiResponse<ResultItem>>(`/result/${id}`);
    return response.data;
  },

  getResultsByOrderId: async (orderId: string): Promise<ApiResponse<ResultItem[]>> => {
    const response = await axiosInstance.get<ApiResponse<ResultItem[]>>(`/result/order/${orderId}`);
    return response.data;
  },

  updateResult: async (id: string, payload: EditResultFormValues): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.patch<ApiResponse<string>>(`/result/${id}`, payload);
    return response.data;
  },
};