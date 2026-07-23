import { axiosInstance } from "@/config/axios";
import {
  TestCatalogPayload,
  TestCatalogItem,
  CreatedTestCatalogResponseData,
  ApiResponse,
  PanelCatalogDetails,
} from "@/types/test-catalog.types";

export const testCatalogService = {
  // GET {{base_url}}/lab-test/list-catalog/{deptId}
  getCatalogByDeptId: async (deptId: string): Promise<TestCatalogItem[]> => {
    const response = await axiosInstance.get<ApiResponse<TestCatalogItem[]>>(
      `/lab-test/list-catalog/${encodeURIComponent(deptId)}`
    );
    return response.data.data ?? [];
  },

  // GET {{base_url}}/lab-test/list-catalog-by-panel/{id}
  getCatalogByPanelId: async (panelId: string): Promise<PanelCatalogDetails> => {
    const response = await axiosInstance.get<ApiResponse<PanelCatalogDetails>>(
      `/lab-test/list-catalog-by-panel/${encodeURIComponent(panelId)}`
    );
    const data = response.data.data;
    if (!data) {
      throw new Error("Panel catalog details missing response data");
    }
    return data;
  },

  // POST {{base_url}}/admin/lab-test/create-catalog
  createCatalog: async (
    payload: TestCatalogPayload
  ): Promise<CreatedTestCatalogResponseData> => {
    const response = await axiosInstance.post<
      ApiResponse<CreatedTestCatalogResponseData>
    >("/admin/lab-test/create-catalog", payload);

    const createdData = response.data.data;
    if (!createdData) {
      throw new Error("Create catalog response missing data");
    }
    return createdData;
  },

  // PATCH {{base_url}}/admin/lab-test/update-catalog
  updateCatalog: async (payload: TestCatalogPayload): Promise<string> => {
    const response = await axiosInstance.patch<ApiResponse<string>>(
      "/admin/lab-test/update-catalog",
      payload
    );
    const updated = response.data.data;
    if (!updated) {
      throw new Error("Update catalog response missing data");
    }
    return updated;
  },
};