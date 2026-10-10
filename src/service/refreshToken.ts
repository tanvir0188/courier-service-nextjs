"use server";

import config from "@/config/config";
import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";

export const getNewAccessToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  if (!refreshToken) {
    return {
      success: false,
      message: "Refresh token not found!",
    };
  }

  try {
    const res = await fetch(`${config.base_url}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-cache",
    });

    const result = await res.json();
    return result;
  } catch (err) {
    console.error("Failed to refresh token", err);
    return {
      success: false,
      message: "Failed to connect to authentication server",
    };
  }
};

export const isAccessTokenExist = async () => {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value || null;
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  if (!accessToken && !refreshToken) {
    return null;
  }

  const decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, config.access_secret)
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(refreshToken, config.refresh_secret)
    : null;

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    // Access token expired but refresh token valid, request new access token
    const result = await getNewAccessToken();

    if (result?.success && result?.data?.accessToken) {
      const newAccessToken = result.data.accessToken;

      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: false,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
        path: "/",
      });

      accessToken = newAccessToken;
    }
  }

  return accessToken;
};
