"use client";

import { useGetMe } from "@/hooks/auth.hook";
import { getAuthRole, getAuthToken } from "@/lib/auth-cookies";
import type { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import AccessDenied from "./access-denied";
import AuthLoading from "./auth-loading";

interface RoleGuardProps {
  children: ReactNode;
  roles: UserRole[];
}

export default function RoleGuard({ children, roles }: RoleGuardProps) {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();

  const user = data?.data;
  const cookieRole = typeof window !== "undefined" ? getAuthRole() : null;
  const effectiveRole = user?.role || cookieRole;

  const isAuthorized = !!effectiveRole && roles.includes(effectiveRole);

  useEffect(() => {
    if (isPending) return;

    const hasSession =
      typeof window !== "undefined" && (!!getAuthToken() || !!getAuthRole());

    if (!hasSession && (isError || !user)) {
      router.replace("/login");
    }
  }, [isPending, isError, user, router]);

  if (isPending) {
    return <AuthLoading />;
  }

  const hasSession =
    typeof window !== "undefined" && (!!getAuthToken() || !!getAuthRole());
  if (!hasSession && (isError || !user)) {
    return <AuthLoading label="Redirecting..." />;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return <AccessDenied />;
}
