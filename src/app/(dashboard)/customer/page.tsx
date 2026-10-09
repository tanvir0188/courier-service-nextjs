"use client";

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
import { Plus, ArrowUpRight, Radio, Package, ExternalLink } from "lucide-react";
import { useGetDashboardStats } from "@/hooks/stats.hook";
import { useGetAllShipments } from "@/hooks/shipment.hook";
import { useGetMe } from "@/hooks/auth.hook";
import { useShipmentSocket } from "@/hooks/socket.hook";
import type { ICustomerDashboardStats } from "@/types";

export default function CustomerDashboardPage() {
  const { data: userRes } = useGetMe();
  const { data: statsRes, isLoading: isStatsLoading } = useGetDashboardStats();
  const { data: shipmentsRes, isLoading: isShipmentsLoading } = useGetAllShipments({
    limit: 5,
  });

  // Enable live Socket.io updates for shipments
  const { isConnected } = useShipmentSocket();

  const user = userRes?.data;
  const userName = user?.name ? user.name.split(" ")[0] : "Customer";
  const stats = (statsRes?.data || {}) as ICustomerDashboardStats;
  const shipments = shipmentsRes?.data || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-primary tracking-wider uppercase mb-1">
            <span>// CUSTOMER PORTAL</span>
            {isConnected && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Radio className="size-3 animate-pulse" /> Live Socket
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Welcome back, {userName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time drone & logistics tracking across Bangladesh.
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
          value={isStatsLoading ? "..." : String(stats.activeShipments ?? 0)}
          trend="Live active deliveries"
        />
        <StatCard
          label="IN TRANSIT"
          value={isStatsLoading ? "..." : String(stats.inTransit ?? 0)}
          trend="En route to destination"
        />
        <StatCard
          label="DELIVERED"
          value={isStatsLoading ? "..." : String(stats.delivered ?? 0)}
          trend="Successfully completed"
        />
        <StatCard
          label="TOTAL SPENT"
          value={isStatsLoading ? "..." : formatBDT(Number(stats.spent ?? 0))}
          trend="Verified online payments"
        />
      </div>

      {/* Recent Shipments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Recent Shipments
            </h2>
            <p className="text-xs text-muted-foreground">
              Your latest parcel dispatches and drone drop-offs
            </p>
          </div>
          <Link
            href="/customer/shipments"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            <span>View all shipments</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[140px] text-xs font-mono">TRACKING</TableHead>
                <TableHead className="text-xs font-mono">DESTINATION</TableHead>
                <TableHead className="text-xs font-mono">RECEIVER</TableHead>
                <TableHead className="text-xs font-mono">WEIGHT</TableHead>
                <TableHead className="text-xs font-mono">STATUS</TableHead>
                <TableHead className="text-right text-xs font-mono">FEE</TableHead>
                <TableHead className="text-right text-xs font-mono w-[80px]">ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isShipmentsLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-28 text-center text-muted-foreground text-sm">
                    Loading your shipments...
                  </TableCell>
                </TableRow>
              ) : shipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package className="size-8 text-muted-foreground/50" />
                      <p className="text-sm font-medium text-muted-foreground">No shipments yet</p>
                      <Link
                        href="/customer/new"
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        Send your first parcel
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                shipments.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-semibold text-foreground">
                      {s.trackingNumber}
                    </TableCell>
                    <TableCell className="text-xs text-foreground">
                      <span className="truncate max-w-[180px] block">
                        {s.receiverAddress}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-foreground">
                      <div>
                        <div className="font-medium">{s.receiverName}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{s.receiverPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {s.weight} kg
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={s.status} />
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono font-semibold text-foreground">
                      {formatBDT(Number(s.totalAmount || s.deliveryFee))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/tracking?number=${encodeURIComponent(s.trackingNumber)}`}
                        className="inline-flex p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors"
                        title="Live Tracking"
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
