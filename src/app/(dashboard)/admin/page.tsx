"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/modules/shared/stat-card";
import { StatusBadge } from "@/components/modules/shared/status-badge";
import { formatBDT } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export default function AdminDashboardPage() {
  const [shipments] = useState([
    {
      id: "DRN-8841",
      route: "Dhaka → Chattogram",
      receiver: "Tanvir Alam",
      courier: "Rakib Hasan",
      method: "bKash",
      charge: 620,
      status: "IN_TRANSIT",
    },
    {
      id: "DRN-8839",
      route: "Dhaka → Dhaka",
      receiver: "Farhana Akter",
      courier: "Sadia Afrin",
      method: "bKash",
      charge: 90,
      status: "OUT_FOR_DELIVERY",
    },
    {
      id: "DRN-8836",
      route: "Dhaka → Dhaka",
      receiver: "Nusrat Jahan",
      courier: "Karim Sheikh",
      method: "SSLCommerz",
      charge: 110,
      status: "DELIVERED",
    },
    {
      id: "DRN-8833",
      route: "Sylhet → Dhaka",
      receiver: "Sadia Rahman",
      courier: "Unassigned",
      method: "Stripe",
      charge: 850,
      status: "PAYMENT_CONFIRMED",
    },
    {
      id: "DRN-8830",
      route: "Dhaka → Barishal",
      receiver: "Rafiq Islam",
      courier: "Nadia Rahman",
      method: "bKash",
      charge: 740,
      status: "DELIVERY_FAILED",
    },
  ]);

  const [payments] = useState([
    {
      txn: "TXN-50231",
      method: "bKash",
      amount: 620,
      status: "Successful",
    },
    {
      txn: "TXN-50230",
      method: "bKash",
      amount: 90,
      status: "Successful",
    },
    {
      txn: "TXN-50228",
      method: "Stripe",
      amount: 1150,
      status: "Processing",
    },
    {
      txn: "TXN-50225",
      method: "SSLCommerz",
      amount: 110,
      status: "Successful",
    },
    {
      txn: "TXN-50221",
      method: "Stripe",
      amount: 850,
      status: "Successful",
    },
  ]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div>
        <div className="text-xs font-mono font-semibold text-primary tracking-wider uppercase mb-1">
          // PLATFORM OVERVIEW
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Admin console
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Users, shipments and payments across every provider.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="TOTAL USERS"
          value="2,416"
          trend="▲ 38 this week"
        />
        <StatCard
          label="PROVIDERS"
          value="14"
          subtext="2 pending review"
        />
        <StatCard
          label="SHIPMENTS · 30D"
          value="9,842"
          subtext="96.3% delivered"
        />
        <StatCard
          label="VOLUME · 30D"
          value="৳ 8.42L"
          subtext="Online payments"
        />
      </div>

      {/* Dual Tables: Latest shipments + Latest payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Shipments */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Latest shipments</h2>
            <Link
              href="/admin/shipments"
              className={buttonVariants({ variant: "ghost", size: "sm", className: "text-xs text-primary gap-1" })}
            >
              <span>View all</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="rounded-xl border border-border/40 bg-card/60 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Tracking ID
                    </TableHead>
                    <TableHead className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Route
                    </TableHead>
                    <TableHead className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Receiver
                    </TableHead>
                    <TableHead className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Method
                    </TableHead>
                    <TableHead className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((s) => (
                    <TableRow
                      key={s.id}
                      className="border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <TableCell className="font-mono text-xs font-semibold text-foreground">
                        {s.id}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {s.route}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground">
                        {s.receiver}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {s.method}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={s.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Latest Payments */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Latest payments</h2>
            <Link
              href="/admin/payments"
              className={buttonVariants({ variant: "ghost", size: "sm", className: "text-xs text-primary gap-1" })}
            >
              <span>View all</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="rounded-xl border border-border/40 bg-card/60 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      TXN
                    </TableHead>
                    <TableHead className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Method
                    </TableHead>
                    <TableHead className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Amount
                    </TableHead>
                    <TableHead className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow
                      key={p.txn}
                      className="border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <TableCell className="font-mono text-xs font-semibold text-foreground">
                        {p.txn}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {p.method}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-foreground">
                        {formatBDT(p.amount)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
