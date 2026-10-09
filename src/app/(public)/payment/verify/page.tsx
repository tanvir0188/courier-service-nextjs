"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { useVerifyCheckoutSession } from "@/hooks/payment.hook";
import { CheckCircle2, AlertCircle, Radio, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatBDT } from "@/lib/utils";
import type { Payment } from "@/types";

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("sessionId") || searchParams.get("session_id") || "";

  const [payment, setPayment] = useState<Payment | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const verifyMutation = useVerifyCheckoutSession();

  useEffect(() => {
    if (!sessionId) {
      setErrorMsg("No payment session ID provided.");
      return;
    }

    verifyMutation.mutate(sessionId, {
      onSuccess: (res) => {
        if (res?.data) {
          setPayment(res.data);
        }
      },
      onError: (err: any) => {
        setErrorMsg(err?.message || "Failed to verify Stripe payment session.");
      },
    });
  }, [sessionId]);

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <Card className="p-8 border-border/50 bg-card/80 backdrop-blur-md shadow-2xl text-center space-y-6">
        {verifyMutation.isPending && (
          <div className="space-y-4 py-8">
            <Radio className="size-10 animate-pulse text-primary mx-auto" />
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">Confirming Payment</h2>
              <p className="text-xs text-muted-foreground">
                Reconciling Stripe checkout session with DRONET ledger...
              </p>
            </div>
          </div>
        )}

        {payment && (
          <div className="space-y-5">
            <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="size-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Payment Confirmed!
              </h1>
              <p className="text-xs text-muted-foreground">
                Your shipment payment has been verified and registered.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/30 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gateway:</span>
                <span className="font-mono font-medium text-foreground">{payment.gateway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-mono text-emerald-400 font-semibold">{payment.status}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-border/30">
                <span>Amount Paid:</span>
                <span className="font-mono text-primary text-sm">
                  {formatBDT(Number(payment.amount))}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/customer/shipments"
                className={buttonVariants({ className: "w-full font-semibold gap-1.5" })}
              >
                <span>View in Shipments</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/"
                className={buttonVariants({ variant: "outline", className: "w-full" })}
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {errorMsg && !verifyMutation.isPending && (
          <div className="space-y-4 py-4">
            <div className="size-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
              <AlertCircle className="size-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">Verification Warning</h2>
              <p className="text-xs text-muted-foreground">{errorMsg}</p>
            </div>
            <Link
              href="/customer/shipments"
              className={buttonVariants({ variant: "outline", className: "w-full text-xs" })}
            >
              Return to Shipments
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
