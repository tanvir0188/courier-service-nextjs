import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateCheckoutSessionPayload,
  Payment,
} from "@/types";

export function getAllPayments(params?: {
  page?: number;
  limit?: number;
  gateway?: string;
  status?: string;
}) {
  return apiClient<ApiResponse<Payment[]>>("/payment", {
    query: params,
  });
}

export function getPaymentByShipmentId(shipmentId: string) {
  return apiClient<ApiResponse<Payment>>(`/payment/shipment/${shipmentId}`);
}

export function createCheckoutSession(payload: CreateCheckoutSessionPayload) {
  return apiClient<ApiResponse<{ url: string; sessionId: string }>>("/payment/create-checkout-session", {
    method: "POST",
    body: payload,
  });
}

export function verifyCheckoutSession(payload: { sessionId: string }) {
  return apiClient<ApiResponse<Payment>>("/payment/verify-session", {
    method: "POST",
    body: payload,
  });
}
