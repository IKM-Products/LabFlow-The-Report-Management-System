// src/services/lab.service.ts

import api from "@/axios/instance";
import { API_ENDPOINTS } from "@/config/axios";
import {
  extractApiData,
  extractApiList,
} from "@/lib/api-response";
import type {
  CreateLabPayload,
  Lab,
  UpdateLabPayload,
} from "@/types/lab.types";

function cleanPayload(
  payload: CreateLabPayload | UpdateLabPayload,
) {
  return {
    lab_name: payload.lab_name.trim(),
    tagline: payload.tagline?.trim() || undefined,
    address: payload.address?.trim() || undefined,
    phone: payload.phone?.trim() || undefined,
    email: payload.email?.trim() || undefined,
    website: payload.website?.trim() || undefined,
    logo_path: payload.logo_path?.trim() || undefined,
    registration_no:
      payload.registration_no?.trim() || undefined,
    report_footer:
      payload.report_footer?.trim() || undefined,
  };
}

export const labService = {
  async create(payload: CreateLabPayload): Promise<Lab> {
    const response = await api.post(
      API_ENDPOINTS.labs.create,
      cleanPayload(payload),
    );

    return extractApiData<Lab>(response.data);
  },

  async getAll(): Promise<Lab[]> {
    const response = await api.get(
      API_ENDPOINTS.labs.getAll,
    );

    return extractApiList<Lab>(response.data);
  },

  async getById(labId: string): Promise<Lab> {
    if (!labId.trim()) {
      throw new Error("Lab ID is required.");
    }

    const response = await api.get(
      API_ENDPOINTS.labs.getById(labId),
    );

    return extractApiData<Lab>(response.data);
  },

  async update(
    labId: string,
    payload: UpdateLabPayload,
  ): Promise<Lab> {
    if (!labId.trim()) {
      throw new Error("Lab ID is required.");
    }

    const response = await api.patch(
      API_ENDPOINTS.labs.update(labId),
      cleanPayload(payload),
    );

    return extractApiData<Lab>(response.data);
  },
};