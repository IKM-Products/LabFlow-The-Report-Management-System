import { axiosInstance } from "@/config/axios";
import {
  TestParameterPayload,
  TestParameterItem,
  ApiResponse,
} from "@/types/test-parameter.types";
import axios from "axios";

export const testParameterService = {
  // GET: Fetch test parameters by Test Catalog ID
  getParametersByTestId: async (
    testId: string
  ): Promise<ApiResponse<TestParameterItem[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<TestParameterItem[]>>(
        `/lab-test/list-test-parameter/${testId}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.messages || ["Failed to fetch test parameters"];
    }
  },

  // POST: Create test parameter
  createParameter: async (
    payload: TestParameterPayload
  ): Promise<ApiResponse<string>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<string>>(
        "/admin/lab-test/create-test-parameter",
        payload
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.messages || ["Failed to create test parameter"];
    }
  },

  // PATCH: Update test parameter
  updateParameter: async (
    payload: TestParameterPayload
  ): Promise<ApiResponse<string>> => {
    try {
      const response = await axiosInstance.patch<ApiResponse<string>>(
        "/admin/lab-test/update-test-parameter",
        payload
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.messages || ["Failed to update test parameter"];
    }
  },
};