"use client";

import { useGetMe } from "@/hooks/auth.hook";
import { getAuthRole, getAuthToken } from "@/lib/auth-cookies";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();

  const user = data?.data;

  useEffect(() => {
    if (isPending) return;

    // Check if active cookie session exists
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
    return <AuthLoading label="Redirecting to login..." />;
  }

  return <>{children}</>;
}
