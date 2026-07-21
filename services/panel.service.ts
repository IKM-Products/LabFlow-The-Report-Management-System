import axiosInstance from "@/config/axios";
import {
  ApiResponse,
  CreatePanelPayload,
  CreatedPanelData,
  UpdatePanelPayload,
  PanelListItem,
  CreatePanelComponentPayload,
  PanelCatalogItem,
} from "@/types/panel.types";

export const panelService = {
  // POST: Create Panel
  createPanel: async (payload: CreatePanelPayload): Promise<ApiResponse<CreatedPanelData>> => {
    const response = await axiosInstance.post<ApiResponse<CreatedPanelData>>(
      "/admin/lab-test/create-panel",
      payload
    );
    return response.data;
  },

  // PATCH: Update Panel
  updatePanel: async (payload: UpdatePanelPayload): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.patch<ApiResponse<string>>(
      "/admin/lab-test/update-panel",
      payload
    );
    return response.data;
  },

  // GET: List Panels by Dept ID
  getPanelsByDeptId: async (deptId: string): Promise<ApiResponse<PanelListItem[]>> => {
    const response = await axiosInstance.get<ApiResponse<PanelListItem[]>>(
      `/lab-test/list-panel/${encodeURIComponent(deptId)}`
    );
    return response.data;
  },

  // POST: Create Panel Component
  createPanelComponent: async (
    payload: CreatePanelComponentPayload
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post<ApiResponse<string>>(
      "/admin/lab-test/create-panel-component",
      payload
    );
    return response.data;
  },

  // GET: Get Panel Catalog by Panel ID
  getPanelCatalog: async (panelId: string): Promise<ApiResponse<PanelCatalogItem[]>> => {
    const response = await axiosInstance.get<ApiResponse<PanelCatalogItem[]>>(
      `/lab-test/list-panel-catalog/${encodeURIComponent(panelId)}`
    );
    return response.data;
  },
};