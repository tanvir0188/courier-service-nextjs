"use client";

import { useGetMe } from "@/hooks/auth.hook";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();

  const user = data?.data;

  useEffect(() => {
    if (isPending) return;

    // Check if demo token or real session exists
    const hasToken = typeof window !== "undefined" && !!localStorage.getItem("access_token");

    if (!hasToken && (isError || !user)) {
      router.replace("/login");
    }
  }, [isPending, isError, user, router]);

  if (isPending) {
    return <AuthLoading />;
  }

  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("access_token");
  if (!hasToken && (isError || !user)) {
    return <AuthLoading label="Redirecting to login..." />;
  }

  return <>{children}</>;
}
