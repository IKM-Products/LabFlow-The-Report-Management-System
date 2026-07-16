// services/report.service.ts
import api from "@/config/axios";
import { Report, PrintLog, ApiResponse } from "@/types/report.types";
import { CreateReportFormValues, EditReportFormValues, PrintReportFormValues } from "@/schemas/report.schema";

export const reportService = {
  createReport: async (data: CreateReportFormValues): Promise<ApiResponse<Report>> => {
    const response = await api.post<ApiResponse<Report>>("/report", data);
    return response.data;
  },

  getReportById: async (id: string): Promise<ApiResponse<Report>> => {
    const response = await api.get<ApiResponse<Report>>(`/report/${id}`);
    return response.data;
  },

  updateReport: async (id: string, data: EditReportFormValues): Promise<ApiResponse<string>> => {
    const response = await api.patch<ApiResponse<string>>(`/report/${id}`, data);
    return response.data;
  },

  createReportPrint: async (id: string, data: PrintReportFormValues): Promise<ApiResponse<PrintLog>> => {
    const response = await api.post<ApiResponse<PrintLog>>(`/report/${id}/print`, data);
    return response.data;
  },

  getReportsByVisitId: async (visitId: string): Promise<ApiResponse<Report[]>> => {
    const response = await api.get<ApiResponse<Report[]>>(`/report/visit/${visitId}`);
    return response.data;
  },

  getReportPrints: async (id: string): Promise<ApiResponse<PrintLog[]>> => {
    const response = await api.get<ApiResponse<PrintLog[]>>(`/report/${id}/prints`);
    return response.data;
  },
};