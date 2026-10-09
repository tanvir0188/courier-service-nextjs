import apiClient from "@/lib/apiClient";
import type { ApiResponse, User, UserRole } from "@/types";

export function getAllUsers(params?: { role?: UserRole; searchTerm?: string }) {
  return apiClient<ApiResponse<User[]>>("/user", {
    query: params,
  });
}

export function toggleUserStatus(userId: string) {
  return apiClient<ApiResponse<User>>(`/user/${userId}/toggle-status`, {
    method: "PATCH",
  });
}
