"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRegistration } from "@/hooks/auth.hook";
import { toast } from "sonner";
import { Radio, Lock, Mail, User as UserIcon, Phone } from "lucide-react";
import type { UserRole } from "@/types";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("CUSTOMER");
  const router = useRouter();
  const registerMutation = useRegistration();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(
      { name, email, password, phone, role },
      {
        onSuccess: () => {
          toast.success("Account created! Please verify your email.");
          router.push(`/verify?email=${encodeURIComponent(email)}`);
        },
        onError: () => {
          toast.error("Registration failed. Please check inputs.");
        },
      }
    );
  };

  return (
    <Card className="p-6 sm:p-8 border-border/40 bg-card/70 backdrop-blur-md shadow-2xl">
      <div className="text-center space-y-1.5 mb-6">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mx-auto mb-2">
          <Radio className="size-5 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Create your Account</h1>
        <p className="text-xs text-muted-foreground">
          Join the DRONET courier delivery network
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Role Toggle */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Account Type</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("CUSTOMER")}
              className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                role === "CUSTOMER"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 border-border/50 text-muted-foreground"
              }`}
            >
              Customer (Sender)
            </button>
            <button
              type="button"
              onClick={() => setRole("PROVIDER")}
              className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                role === "PROVIDER"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 border-border/50 text-muted-foreground"
              }`}
            >
              Courier Provider
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Full Name</Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sadia Rahman"
              className="pl-9 text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sadia@example.com"
              className="pl-9 text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01711-204518"
              className="pl-9 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Password</Label>
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
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating account..." : "Sign up"}
        </Button>
      </form>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </Card>
  );
}
