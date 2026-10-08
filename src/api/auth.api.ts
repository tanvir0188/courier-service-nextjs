import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  LoginPayload,
  RegisterPayload,
  User,
  VerifyEmailPayload,
} from "@/types";

export function userLogin(payload: LoginPayload) {
  return apiClient<ApiResponse<{ user: User; accessToken?: string; token?: string }>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function userRegistration(payload: RegisterPayload) {
  return apiClient<ApiResponse<User>>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function verifyEmail(payload: VerifyEmailPayload) {
  return apiClient<ApiResponse<{ user: User; accessToken?: string }>>("/auth/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function getMe() {
  return apiClient<ApiResponse<User>>("/auth/me");
}

export function googleOAuth(payload: { idToken?: string; token?: string }) {
  return apiClient<ApiResponse<{ user: User; accessToken?: string }>>("/auth/google", {
    method: "POST",
    body: payload,
  });
}

export function forgotPassword(payload: { email: string }) {
  return apiClient<ApiResponse<{ message: string }>>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export function resetPassword(payload: { email: string; otp: string; newPassword?: string; password?: string }) {
  return apiClient<ApiResponse<{ message: string }>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

export function userLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
  }
}
