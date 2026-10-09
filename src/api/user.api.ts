import apiClient from "@/lib/apiClient";
import type { ApiResponse, User, UserRole } from "@/types";

export function getAllUsers(params?: {
  role?: UserRole;
  searchTerm?: string;
  page?: number;
  limit?: number;
}) {
  return apiClient<ApiResponse<User[]>>("/user", {
    query: params,
  });
}

export function toggleUserStatus(userId: string, isActive?: boolean) {
  return apiClient<ApiResponse<User>>(`/user/${userId}/toggle-status`, {
    method: "PATCH",
    body: isActive !== undefined ? { isActive } : undefined,
  });
}

export function updateProfile(payload: { name?: string; phone?: string; profilePic?: string } | FormData) {
  return apiClient<ApiResponse<User>>("/user/profile", {
    method: "PATCH",
    body: payload,
  });
}
