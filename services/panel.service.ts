import { axiosInstance } from "@/config/axios";
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
  // POST {{base_url}}/admin/lab-test/create-panel
  createPanel: async (payload: CreatePanelPayload): Promise<CreatedPanelData> => {
    const response = await axiosInstance.post<ApiResponse<CreatedPanelData>>(
      "/admin/lab-test/create-panel",
      payload
    );
    return response.data.data;
  },

  // PATCH {{base_url}}/admin/lab-test/update-panel
  updatePanel: async (payload: UpdatePanelPayload): Promise<string> => {
    const response = await axiosInstance.patch<ApiResponse<string>>(
      "/admin/lab-test/update-panel",
      payload
    );
    return response.data.data;
  },

  // GET {{base_url}}/lab-test/list-panel/{deptId}
  getPanelsByDeptId: async (deptId: string): Promise<PanelListItem[]> => {
    const response = await axiosInstance.get<ApiResponse<PanelListItem[]>>(
      `/lab-test/list-panel/${encodeURIComponent(deptId)}`
    );
    return response.data.data;
  },

  // POST {{base_url}}/admin/lab-test/create-panel-component
  createPanelComponent: async (
    payload: CreatePanelComponentPayload
  ): Promise<string> => {
    const response = await axiosInstance.post<ApiResponse<string>>(
      "/admin/lab-test/create-panel-component",
      payload
    );
    return response.data.data;
  },

  // GET {{base_url}}/lab-test/list-panel-catalog/{panelId}
  getPanelCatalog: async (panelId: string): Promise<PanelCatalogItem[]> => {
    const response = await axiosInstance.get<ApiResponse<PanelCatalogItem[]>>(
      `/lab-test/list-panel-catalog/${encodeURIComponent(panelId)}`
    );
    return response.data.data;
  },
};