import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  DashboardStats,
} from "@/types";

export function getDashboardStats() {
  return apiClient<ApiResponse<DashboardStats>>("/dashboard-stats");
}
