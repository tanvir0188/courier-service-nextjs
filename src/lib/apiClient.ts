import { type FetchError, ofetch } from "ofetch";
import type { ApiErrorResponse } from "@/types";

export type ApiFetchError = FetchError<ApiErrorResponse>;

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (!error) return fallback;

  // ofetch typed error with backend response body in .data
  const fetchErr = error as { data?: ApiErrorResponse; message?: string };
  if (fetchErr.data?.message) {
    return fetchErr.data.message;
  }

  if (typeof fetchErr.message === "string" && !fetchErr.message.includes("[object Object]")) {
    return fetchErr.message;
  }

  return fallback;
}

import { getAuthToken, removeAuthCookies } from "./auth-cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  onRequest({ options }) {
    if (typeof window !== "undefined") {
      const token = getAuthToken();
      if (token) {
        const headers = new Headers(options.headers);
        headers.set("Authorization", `Bearer ${token}`);
        options.headers = headers;
      }
    }
  },
  onResponseError({ response, error }) {
    // If backend provided our standard error response with a custom message,
    // ensure error.message reflects it directly
    const errorBody = response._data as ApiErrorResponse | undefined;
    if (error && errorBody?.message) {
      error.message = errorBody.message;
    }

    if (response.status === 401 && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (!pathname.startsWith("/login") && !pathname.startsWith("/register") && !pathname.startsWith("/track")) {
        removeAuthCookies();
      }
    }
  },
});

export default apiClient;
