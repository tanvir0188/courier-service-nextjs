"use client";

import { useGetMe } from "@/hooks/auth.hook";
import { getAuthToken } from "@/lib/auth-cookies";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();

  const user = data?.data;

  useEffect(() => {
    if (isPending) return;

    // Check if cookie session or active user exists
    const hasToken = typeof window !== "undefined" && !!getAuthToken();

    if (!hasToken && (isError || !user)) {
      router.replace("/login");
    }
  }, [isPending, isError, user, router]);

  if (isPending) {
    return <AuthLoading />;
  }

  const hasToken = typeof window !== "undefined" && !!getAuthToken();
  if (!hasToken && (isError || !user)) {
    return <AuthLoading label="Redirecting to login..." />;
  }

  return <>{children}</>;
}
