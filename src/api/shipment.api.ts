import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateShipmentPayload,
  Shipment,
  ShipmentQueryParams,
} from "@/types";

export function getAllShipments(params?: ShipmentQueryParams) {
  return apiClient<ApiResponse<Shipment[]>>("/shipment", {
    query: params,
  });
}

export function getShipmentById(id: string) {
  return apiClient<ApiResponse<Shipment>>(`/shipment/${id}`);
}

export function trackShipment(trackingNumber: string) {
  return apiClient<ApiResponse<Shipment>>(`/shipment/track/${trackingNumber}`);
}

export function createShipment(payload: CreateShipmentPayload) {
  return apiClient<ApiResponse<Shipment>>("/shipment", {
    method: "POST",
    body: payload,
  });
}

export function getAvailableCouriersForShipment(id: string) {
  return apiClient<ApiResponse<any[]>>(`/shipment/${id}/available-couriers`);
}

export function assignCourierToShipment(id: string, payload: { courierId: string; type: "PICKUP" | "DELIVERY" }) {
  return apiClient<ApiResponse<Shipment>>(`/shipment/${id}/assign-courier`, {
    method: "PATCH",
    body: payload,
  });
}
