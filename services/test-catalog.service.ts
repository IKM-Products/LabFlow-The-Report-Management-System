import { axiosInstance } from "@/config/axios";
import { TestCatalogPayload, TestCatalogItem, CreatedTestCatalogResponseData, ApiResponse } from "@/types/test-catalog.types";

export const testCatalogService = {
  // GET: Fetch test catalog by Department ID
  getCatalogByDeptId: async (deptId: string): Promise<ApiResponse<TestCatalogItem[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<TestCatalogItem[]>>(`/lab-test/list-catalog/${deptId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.messages || ["Failed to fetch catalog items"];
    }
  },

  // POST: Create test catalog
  createCatalog: async (payload: TestCatalogPayload): Promise<ApiResponse<CreatedTestCatalogResponseData>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<CreatedTestCatalogResponseData>>("/admin/lab-test/create-catalog", payload);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.messages || ["Failed to create catalog item"];
    }
  },

  // PATCH: Update test catalog
  updateCatalog: async (payload: TestCatalogPayload): Promise<ApiResponse<string>> => {
    try {
      const response = await axiosInstance.patch<ApiResponse<string>>("/admin/lab-test/update-catalog", payload);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.messages || ["Failed to update catalog item"];
    }
  },
};