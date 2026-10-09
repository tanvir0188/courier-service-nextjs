import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Courier,
  CreateCourierPayload,
  UpdateCourierPayload,
} from "@/types";

export function getAllCouriers(params?: { zoneId?: string; status?: string }) {
  return apiClient<ApiResponse<Courier[]>>("/courier", {
    query: params,
  });
}

export function getCourierById(id: string) {
  return apiClient<ApiResponse<Courier>>(`/courier/${id}`);
}

export function createCourier(payload: CreateCourierPayload) {
  return apiClient<ApiResponse<Courier>>("/courier", {
    method: "POST",
    body: payload,
  });
}

export function updateCourier(id: string, payload: UpdateCourierPayload) {
  return apiClient<ApiResponse<Courier>>(`/courier/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteCourier(id: string) {
  return apiClient<ApiResponse<{ id: string }>>(`/courier/${id}`, {
    method: "DELETE",
  });
}
