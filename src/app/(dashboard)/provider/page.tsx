"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { ArrowUpRight, Bike, ShieldCheck } from "lucide-react";

export default function ProviderDashboardPage() {
  const [couriers] = useState([
    { name: "Rakib Hasan", active: 6, status: "busy" },
    { name: "Sadia Afrin", active: 4, status: "busy" },
    { name: "Karim Sheikh", active: 2, status: "available" },
    { name: "Nadia Rahman", active: 0, status: "off" },
    { name: "Imran Khan", active: 3, status: "available" },
  ]);

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
    {
      id: "DRN-8827",
      route: "Khulna → Dhaka",
      receiver: "Shirin Sultana",
      courier: "Imran Khan",
      method: "SSLCommerz",
      charge: 680,
      status: "RETURNED",
    },
  ]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-semibold text-primary tracking-wider uppercase mb-1">
            // LIVE OPERATIONS
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Shipment control
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track every parcel across Dhaka and Chattogram — from payment confirmation to doorstep delivery.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="ACTIVE SHIPMENTS"
          value="128"
          trend="▲ 12 since morning"
        />
        <StatCard
          label="AWAITING COURIER"
          value="9"
          actionText="Assign now →"
          onAction={() => {}}
        />
        <StatCard
          label="OUT FOR DELIVERY"
          value="19"
          subtext="2 delayed"
        />
        <StatCard
          label="TODAY'S REVENUE"
          value={formatBDT(82400)}
          subtext="Across 3 methods"
        />
      </div>

      {/* Split Section: Recent Shipments + Couriers Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Shipments Table */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Recent shipments</h2>
            <Button asChild variant="ghost" size="sm" className="text-xs text-primary">
              <Link href="/provider/shipments" className="flex items-center gap-1">
                <span>View dispatch</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
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
                      Courier
                    </TableHead>
                    <TableHead className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Method
                    </TableHead>
                    <TableHead className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Charge
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
                      <TableCell className="text-xs text-muted-foreground">
                        {s.courier}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {s.method}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-foreground">
                        {formatBDT(s.charge)}
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

        {/* Couriers Workload Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Couriers</h2>
            <Button asChild variant="ghost" size="sm" className="text-xs text-primary">
              <Link href="/provider/couriers" className="flex items-center gap-1">
                <span>Manage fleet</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          <Card className="p-4 border-border/40 bg-card/60 divide-y divide-border/30">
            {couriers.map((c) => (
              <div key={c.name} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`size-2 rounded-full ${
                      c.status === "available"
                        ? "bg-emerald-400"
                        : c.status === "busy"
                        ? "bg-amber-400"
                        : "bg-muted-foreground"
                    }`}
                  />
                  <span className="text-xs font-medium text-foreground">{c.name}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {c.active} active
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
