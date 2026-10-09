import configuration from "@/config/config";
import { getNewAccessToken } from "@/service/refreshToken";
import { jwtUtils } from "@/utils/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register", "/verify"];
const PUBLIC_ROUTES = [
  "/",
  "/tracking",
  "/services",
  "/pricing",
  "/about",
  "/contact",
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  let userRole = request.cookies.get("user_role")?.value || null;

  // Verify / decode access token
  let decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, configuration.access_secret)
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(refreshToken, configuration.refresh_secret)
    : null;

  // If access token expired but refresh token is valid, refresh it
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();
    if (result?.success && result?.data?.accessToken) {
      accessToken = result.data.accessToken;
      decodedAccessToken = jwtUtils.verifyToken(
        accessToken!,
        configuration.access_secret
      );
    }
  }

  if (decodedAccessToken?.success && decodedAccessToken.data?.role) {
    userRole = decodedAccessToken.data.role;
  }

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // 1. If user is logged in and trying to access login/register/verify, redirect to their role dashboard
  if (accessToken && isAuthRoute) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (userRole === "PROVIDER") {
      return NextResponse.redirect(new URL("/provider", request.url));
    }
    return NextResponse.redirect(new URL("/customer", request.url));
  }

  // 2. Unauthenticated user accessing protected page -> redirect to login with redirectTo
  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. RBAC Route Protection: Role isolation
  if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
    const redirectUrl = new URL(
      userRole === "PROVIDER" ? "/provider" : "/customer",
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith("/provider") && userRole !== "PROVIDER") {
    const redirectUrl = new URL(
      userRole === "ADMIN" ? "/admin" : "/customer",
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith("/customer") && userRole !== "CUSTOMER") {
    const redirectUrl = new URL(
      userRole === "ADMIN" ? "/admin" : "/provider",
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
