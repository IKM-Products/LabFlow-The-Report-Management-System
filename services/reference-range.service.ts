import { axiosInstance } from "@/config/axios";
import {
  ReferenceRangePayload,
  ReferenceRangeItem,
  ApiResponse,
} from "@/types/reference-range.types";

export const referenceRangeService = {
  // GET: Fetch reference ranges by Parameter ID
  getReferenceByParameterId: async (
    parameterId: string
  ): Promise<ApiResponse<ReferenceRangeItem[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<ReferenceRangeItem[]>>(
        `/lab-test/list-reference/${parameterId}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.messages || ["Failed to fetch reference ranges"];
    }
  },

  // POST: Create reference range
  createReference: async (
    payload: ReferenceRangePayload
  ): Promise<ApiResponse<string>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<string>>(
        "/admin/lab-test/create-reference",
        payload
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.messages || ["Failed to create reference range"];
    }
  },

  // PATCH: Update reference range
  updateReference: async (
    payload: ReferenceRangePayload
  ): Promise<ApiResponse<string>> => {
    try {
      const response = await axiosInstance.patch<ApiResponse<string>>(
        "/admin/lab-test/update-reference",
        payload
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.messages || ["Failed to update reference range"];
    }
  },
};

export type { ReferenceRangePayload };
