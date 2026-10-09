import apiClient from "@/lib/apiClient";
import type { ApiResponse, CreateZonePayload, Zone } from "@/types";

export function getAllZones() {
  return apiClient<ApiResponse<Zone[]>>("/zone");
}

export function createZone(payload: CreateZonePayload) {
  return apiClient<ApiResponse<Zone>>("/zone", {
    method: "POST",
    body: payload,
  });
}
