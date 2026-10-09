"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/auth.hook";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiClient";
import { Radio, Lock, Mail, ArrowRight } from "lucide-react";
import type { UserRole } from "@/types";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const loginMutation = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (res) => {
          toast.success("Welcome back!");
          const userRole = res.data?.user?.role || "CUSTOMER";
          localStorage.setItem("user_role", userRole);
          if (userRole === "ADMIN") router.push("/admin");
          else if (userRole === "PROVIDER") router.push("/provider");
          else router.push("/customer");
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to login with backend."));
        },
      }
    );
  };

  const handleDemoLogin = (role: UserRole) => {
    localStorage.setItem("access_token", `demo_${role.toLowerCase()}_token`);
    localStorage.setItem("user_role", role);
    toast.success(`Logged in as ${role}`);
    if (role === "ADMIN") router.push("/admin");
    else if (role === "PROVIDER") router.push("/provider");
    else router.push("/customer");
  };

  return (
    <Card className="p-6 sm:p-8 border-border/40 bg-card/70 backdrop-blur-md shadow-2xl">
      <div className="text-center space-y-1.5 mb-6">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mx-auto mb-2">
          <Radio className="size-5 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Sign in to DRONET</h1>
        <p className="text-xs text-muted-foreground">
          Enter your credentials or use quick demo profiles
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
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full font-semibold"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Authenticating..." : "Sign in"}
        </Button>
      </form>

      {/* Demo Portals */}
      <div className="mt-6 pt-6 border-t border-border/40 text-center">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
          Quick Demo Bypass
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("CUSTOMER")}
            className="text-xs"
          >
            Customer
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("PROVIDER")}
            className="text-xs"
          >
            Provider
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("ADMIN")}
            className="text-xs"
          >
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
