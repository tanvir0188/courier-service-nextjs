"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/auth.hook";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiClient";
import { setAuthCookies } from "@/lib/auth-cookies";
import { fastLoginDemoAction } from "../_actions/authActions";
import { Radio, Lock, Mail, ShieldCheck, Truck, User } from "lucide-react";
import type { UserRole } from "@/types";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "";

  const loginMutation = useLogin();
  const [isFastLoginPending, startFastLogin] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (res) => {
          toast.success("Welcome back!");
          const userRole = (res.data?.user?.role || "CUSTOMER") as UserRole;
          const token = res.data?.accessToken || res.data?.token || "";
          
          setAuthCookies(token, undefined, userRole);

          if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
            router.push(redirectTo);
          } else if (userRole === "ADMIN") {
            router.push("/admin");
          } else if (userRole === "PROVIDER") {
            router.push("/provider");
          } else {
            router.push("/customer");
          }
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to login with backend."));
        },
      }
    );
  };

  const handleFastLogin = (role: "customer" | "provider" | "admin") => {
    startFastLogin(async () => {
      try {
        const result = await fastLoginDemoAction(role, redirectTo);
        if (result && !result.success) {
          toast.error(result.message || "Fast demo login failed");
        }
      } catch (err) {
        // Handled via redirect inside server action
      }
    });
  };

  const isPending = loginMutation.isPending || isFastLoginPending;

  return (
    <Card className="p-6 sm:p-8 border-border/40 bg-card/70 backdrop-blur-md shadow-2xl">
      <div className="text-center space-y-1.5 mb-6">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mx-auto mb-2">
          <Radio className="size-5 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Sign in to DRONET</h1>
        <p className="text-xs text-muted-foreground">
          Cookie-authenticated session with Role-Based Access Control
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@dronet.io"
              className="pl-9 text-sm"
              disabled={isPending}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Password</Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-9 text-sm"
              disabled={isPending}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full font-semibold cursor-pointer"
          disabled={isPending}
        >
          {loginMutation.isPending ? "Authenticating..." : "Sign in"}
        </Button>
      </form>

      {/* Fast Demo Portals with Server Action Cookies */}
      <div className="mt-6 pt-6 border-t border-border/40 text-center">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
          One-Click Demo Portals (RBAC Cookies)
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleFastLogin("customer")}
            disabled={isPending}
            className="text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:border-primary/50"
          >
            <User className="size-3.5 text-sky-400" />
            Customer
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleFastLogin("provider")}
            disabled={isPending}
            className="text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:border-primary/50"
          >
            <Truck className="size-3.5 text-amber-400" />
            Provider
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleFastLogin("admin")}
            disabled={isPending}
            className="text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:border-primary/50"
          >
            <ShieldCheck className="size-3.5 text-emerald-400" />
            Admin
          </Button>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Create account
        </Link>
      </div>
    </Card>
  );
}
