"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useVerifyEmail } from "@/hooks/auth.hook";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiClient";
import { KeyRound } from "lucide-react";

export default function VerifyPage() {
  const [otp, setOtp] = useState("");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const router = useRouter();
  const verifyMutation = useVerifyEmail();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    verifyMutation.mutate(
      { email, otp },
      {
        onSuccess: () => {
          toast.success("Email verified successfully!");
          router.push("/customer");
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Invalid or expired OTP"));
        },
      }
    );
  };

  return (
    <Card className="p-6 sm:p-8 border-border/40 bg-card/70 backdrop-blur-md shadow-2xl text-center">
      <div className="space-y-1.5 mb-6">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mx-auto mb-2">
          <KeyRound className="size-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Verify Your Account</h1>
        <p className="text-xs text-muted-foreground">
          Enter the 6-digit verification code sent to{" "}
          <span className="font-semibold text-foreground">{email || "your email"}</span>
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="submit"
          className="w-full font-semibold"
          disabled={verifyMutation.isPending || otp.length < 6}
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify & Continue"}
        </Button>
      </form>
    </Card>
  );
}
