"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useGetAllPayments } from "@/hooks/payment.hook";
import { formatBDT } from "@/lib/utils";
import { CreditCard, Search, DollarSign } from "lucide-react";
import type { PaymentStatus } from "@/types";

export default function ProviderPaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");

  const { data: paymentsRes, isLoading } = useGetAllPayments({
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const payments = paymentsRes?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-mono font-semibold text-primary tracking-wider uppercase mb-1">
          // FINANCIAL CLEARING
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Provider Payments & Earnings
        </h1>
        <p className="text-xs text-muted-foreground">
          Audit incoming customer payments and Stripe transactions for dispatched parcels.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring sm:w-[180px]"
        >
          <option value="ALL" className="bg-background text-foreground">
            All Payment Statuses
          </option>
          <option value="SUCCESS" className="bg-background text-foreground">
            Success
          </option>
          <option value="PENDING" className="bg-background text-foreground">
            Pending
          </option>
          <option value="FAILED" className="bg-background text-foreground">
            Failed
          </option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-mono">TRANSACTION ID</TableHead>
              <TableHead className="text-xs font-mono">TRACKING NO</TableHead>
              <TableHead className="text-xs font-mono">GATEWAY</TableHead>
              <TableHead className="text-xs font-mono">STATUS</TableHead>
              <TableHead className="text-xs font-mono">DATE</TableHead>
              <TableHead className="text-right text-xs font-mono">AMOUNT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-sm">
                  Fetching payments records...
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <DollarSign className="size-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No payment records found
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-foreground">
                    {p.transactionId || p.id.slice(0, 13) + "..."}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-foreground">
                    {p.shipment?.trackingNumber || "N/A"}
                  </TableCell>
                  <TableCell className="text-xs font-mono font-medium text-foreground">
                    {p.gateway}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                        p.status === "SUCCESS"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : p.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono font-bold text-foreground">
                    {formatBDT(Number(p.amount))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
