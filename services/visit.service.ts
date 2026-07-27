// services/visit.service.ts

import { axiosInstance } from "@/config/axios";
import { ApiResponse, CreateVisitRequest, CreateVisitResponseData, VisitListItem, UpdateVisitRequest } from "@/types/visit.types";

export const visitService = {
  createVisit: async (payload: CreateVisitRequest): Promise<ApiResponse<CreateVisitResponseData>> => {
    const response = await axiosInstance.post<ApiResponse<CreateVisitResponseData>>("/visit", payload);
    return response.data;
  },

  getVisits: async (): Promise<ApiResponse<VisitListItem[]>> => {
    const response = await axiosInstance.get<ApiResponse<VisitListItem[]>>("/visit");
    return response.data;
  },

  getVisitById: async (id: string): Promise<ApiResponse<VisitListItem>> => {
    const response = await axiosInstance.get<ApiResponse<VisitListItem>>(`/visit/${id}`);
    return response.data;
  },

  getVisitsByPatientId: async (patientId: string): Promise<ApiResponse<VisitListItem[]>> => {
    const response = await axiosInstance.get<ApiResponse<VisitListItem[]>>(`/visit/patient/${patientId}`);
    return response.data;
  },

  updateVisit: async (id: string, payload: UpdateVisitRequest): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.patch<ApiResponse<string>>(`/visit/${id}`, payload);
    return response.data;
  },
};