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
import {
  Radio,
  ArrowUpRight,
  Package,
  Bike,
  Truck,
  ExternalLink,
} from "lucide-react";
import { useGetDashboardStats } from "@/hooks/stats.hook";
import { useGetAllShipments } from "@/hooks/shipment.hook";
import { useGetMe } from "@/hooks/auth.hook";
import { useShipmentSocket } from "@/hooks/socket.hook";
import type { IProviderDashboardStats } from "@/types";

export default function ProviderDashboardPage() {
  const { data: userRes } = useGetMe();
  const { data: statsRes, isLoading: isStatsLoading } = useGetDashboardStats();
  const { data: shipmentsRes, isLoading: isShipmentsLoading } = useGetAllShipments({
    limit: 6,
  });

  const { isConnected } = useShipmentSocket();

  const user = userRes?.data;
  const providerName = user?.name || "Logistics Hub";
  const stats = (statsRes?.data || {}) as IProviderDashboardStats;
  const shipments = shipmentsRes?.data || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-primary tracking-wider uppercase mb-1">
            <span>// PROVIDER OPERATIONS HUB</span>
            {isConnected && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Radio className="size-3 animate-pulse" /> Live Telemetry
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {providerName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Dispatch fleet management, active courier routing, and zone logistics.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/provider/couriers"
            className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}
          >
            <Bike className="size-4 text-primary" />
            <span>Manage Couriers</span>
          </Link>
          <Link
            href="/provider/shipments"
            className={buttonVariants({ size: "sm", className: "gap-1.5 font-semibold" })}
          >
            <Truck className="size-4" />
            <span>Dispatch Center</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="ACTIVE SHIPMENTS"
          value={isStatsLoading ? "..." : String(stats.activeShipments ?? 0)}
          trend="In courier network"
        />
        <StatCard
          label="AWAITING COURIER"
          value={isStatsLoading ? "..." : String(stats.awaitingCourier ?? 0)}
          trend="Payment confirmed, ready"
        />
        <StatCard
          label="OUT FOR DELIVERY"
          value={isStatsLoading ? "..." : String(stats.outForDelivery ?? 0)}
          trend="Last-mile in transit"
        />
        <StatCard
          label="PROVIDER REVENUE"
          value={isStatsLoading ? "..." : formatBDT(Number(stats.totalRevenue ?? 0))}
          trend="Processed online payments"
        />
      </div>

      {/* Active Operational Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Operational Dispatch Queue
            </h2>
            <p className="text-xs text-muted-foreground">
              Shipments requiring courier assignment or status advancement
            </p>
          </div>
          <Link
            href="/provider/shipments"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            <span>Open dispatch desk</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[140px] text-xs font-mono">TRACKING</TableHead>
                <TableHead className="text-xs font-mono">CUSTOMER / SENDER</TableHead>
                <TableHead className="text-xs font-mono">DESTINATION</TableHead>
                <TableHead className="text-xs font-mono">WEIGHT</TableHead>
                <TableHead className="text-xs font-mono">STATUS</TableHead>
                <TableHead className="text-xs font-mono">ASSIGNED COURIER</TableHead>
                <TableHead className="text-right text-xs font-mono w-[100px]">ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isShipmentsLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-28 text-center text-muted-foreground text-sm">
                    Loading dispatch queue...
                  </TableCell>
                </TableRow>
              ) : shipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package className="size-8 text-muted-foreground/50" />
                      <p className="text-sm font-medium text-muted-foreground">
                        No active shipments in your queue
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                shipments.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-bold text-foreground">
                      {s.trackingNumber}
                    </TableCell>
                    <TableCell className="text-xs text-foreground">
                      <div>
                        <div className="font-medium">{s.senderName}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{s.senderPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-foreground">
                      <span className="truncate max-w-[160px] block">
                        {s.receiverAddress}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {s.weight} kg
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={s.status} />
                    </TableCell>
                    <TableCell className="text-xs text-foreground">
                      {s.deliveryCourier?.name || s.pickupCourier?.name ? (
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Bike className="size-3 text-primary" />
                          {s.deliveryCourier?.name || s.pickupCourier?.name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic text-[11px]">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href="/provider/shipments"
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "h-7 text-[11px] px-2",
                        })}
                      >
                        Dispatch
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
