import apiClient from "@/lib/apiClient";
import type { ApiResponse, CreateZonePayload, Zone } from "@/types";

export function getAllZones(params?: { searchTerm?: string; page?: number; limit?: number }) {
  return apiClient<ApiResponse<Zone[]>>("/zone", {
    query: params,
  });
}

export function getZoneById(id: string) {
  return apiClient<ApiResponse<Zone>>(`/zone/${id}`);
}

export function createZone(payload: CreateZonePayload) {
  return apiClient<ApiResponse<Zone>>("/zone", {
    method: "POST",
    body: payload,
  });
}

export function updateZone(id: string, payload: { name: string }) {
  return apiClient<ApiResponse<Zone>>(`/zone/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteZone(id: string) {
  return apiClient<ApiResponse<{ id: string }>>(`/zone/${id}`, {
    method: "DELETE",
  });
}
