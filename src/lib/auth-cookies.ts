import Cookies from "js-cookie";
import type { UserRole } from "@/types";

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";
export const USER_ROLE_COOKIE = "user_role";

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

export function getAuthToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_COOKIE);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_COOKIE);
}

export function getAuthRole(): UserRole | undefined {
  return Cookies.get(USER_ROLE_COOKIE) as UserRole | undefined;
}

export function setAuthCookies(
  accessToken: string,
  refreshToken?: string,
  role?: UserRole
): void {
  Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...COOKIE_OPTIONS,
    expires: 1, // 1 day
  });

  if (refreshToken) {
    Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...COOKIE_OPTIONS,
      expires: 7, // 7 days
    });
  }

  if (role) {
    Cookies.set(USER_ROLE_COOKIE, role, {
      ...COOKIE_OPTIONS,
      expires: 1, // 1 day
    });
  }
}

export function removeAuthCookies(): void {
  Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
  Cookies.remove(USER_ROLE_COOKIE, { path: "/" });
}
