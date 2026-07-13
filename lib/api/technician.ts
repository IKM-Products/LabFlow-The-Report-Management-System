import { apiClient } from "./client";

export const technicianApi = {
  // Authentication & Personal Identity Profile Setup
  login: (credentials: any) => 
    apiClient("/auth/login", { method: "POST", body: credentials }),

  getMe: () => 
    apiClient("/profile/getme"),

  updateProfile: (profileId: string, data: any) => 
    apiClient(`/profile/update-profile/${profileId}`, { method: "PATCH", body: data }),

  // Registry Creators
  createPatient: (data: any) => 
    apiClient("/patient", { method: "POST", body: data }),

  createVisit: (data: any) => 
    apiClient("/visit", { method: "POST", body: data }),

  createOrder: (data: any) => 
    apiClient("/order", { method: "POST", body: data }),

  createResult: (data: any) => 
    apiClient("/report", { method: "POST", body: data }),

  createReport: (data: any) => 
    apiClient("/result", { method: "POST", body: data }),

  // Patient & Clinical Workflows GETs
  getPatients: () => 
    apiClient("/patient"),

  getPatientById: (patientId: string) => 
    apiClient(`/patient/${patientId}`),

  getVisitById: (visitId: string) => 
    apiClient(`/visit/${visitId}`),

  getVisitsByPatientId: (patientId: string) => 
    apiClient(`/visit/patient/${patientId}`),

  getOrderById: (orderId: string) => 
    apiClient(`/order/${orderId}`),

  getOrdersByVisitId: (visitId: string) => 
    apiClient(`/order/visit/${visitId}`),

  getResultById: (resultId: string) => 
    apiClient(`/result/${resultId}`),

  getResultsByOrderId: (orderId: string) => 
    apiClient(`/result/order/${orderId}`),

  getReportById: (reportId: string) => 
    apiClient(`/report/${reportId}`),

  getReportByVisitId: (visitId: string) => 
    apiClient(`/visit/${visitId}`), 

  getReportPrints: (reportId: string) => 
    apiClient(`/report/${reportId}/prints`),

  getReportPrintUrl: (reportId: string) => 
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/report/${reportId}/print`,

  // Workflow PATCH Methods
  updatePatient: (patientId: string, data: any) => 
    apiClient(`/patient/${patientId}`, { method: "PATCH", body: data }),

  updateVisit: (visitId: string, data: any) => 
    apiClient(`/visit/${visitId}`, { method: "PATCH", body: data }),

  updateOrder: (orderId: string, data: any) => 
    apiClient(`/order/${orderId}`, { method: "PATCH", body: data }),

  updateResult: (resultId: string, data: any) => 
    apiClient(`/result/${resultId}`, { method: "PATCH", body: data }),

  updateReport: (reportId: string, data: any) => 
    apiClient(`/report/${reportId}`, { method: "PATCH", body: data }),
};