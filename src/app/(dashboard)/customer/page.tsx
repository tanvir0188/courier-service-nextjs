"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
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
import { Plus, ArrowUpRight } from "lucide-react";

export default function CustomerDashboardPage() {
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
      id: "DRN-8824",
      route: "Dhaka → Rajshahi",
      receiver: "Kamal Uddin",
      courier: "Rakib Hasan",
      method: "Stripe",
      charge: 560,
      status: "PICKED_UP",
    },
  ]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-semibold text-primary tracking-wider uppercase mb-1">
            // CUSTOMER DASHBOARD
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Good evening, Sadia
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track parcels you've sent and received across Bangladesh.
          </p>
        </div>
        <Link
          href="/customer/new"
          className={buttonVariants({ className: "font-semibold shadow-md shrink-0 gap-1.5" })}
        >
          <Plus className="size-4" />
          <span>Create shipment</span>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="ACTIVE SHIPMENTS"
          value="5"
          trend="▲ 2 this week"
        />
        <StatCard
          label="IN TRANSIT"
          value="2"
          subtext="1 arriving today"
        />
        <StatCard
          label="DELIVERED · 30D"
          value="18"
          subtext="97% on time"
        />
        <StatCard
          label="SPENT · 30D"
          value={formatBDT(6840)}
          subtext="All paid online"
        />
      </div>

      {/* Recent Shipments Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Recent shipments</h2>
          <Link
            href="/customer/shipments"
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
    </div>
  );
}
