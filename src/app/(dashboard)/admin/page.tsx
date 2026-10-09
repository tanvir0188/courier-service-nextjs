"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { StatCard } from "@/components/modules/shared/stat-card";
import { formatBDT } from "@/lib/utils";
import {
  Users,
  Building,
  Package,
  CreditCard,
  Radio,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useGetDashboardStats } from "@/hooks/stats.hook";
import { useGetMe } from "@/hooks/auth.hook";
import { useShipmentSocket } from "@/hooks/socket.hook";
import type { IAdminDashboardStats } from "@/types";

export default function AdminDashboardPage() {
  const { data: userRes } = useGetMe();
  const { data: statsRes, isLoading: isStatsLoading } = useGetDashboardStats();
  const { isConnected } = useShipmentSocket();

  const user = userRes?.data;
  const adminName = user?.name || "Administrator";
  const stats = (statsRes?.data || {}) as IAdminDashboardStats;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-primary tracking-wider uppercase mb-1">
            <span>// PLATFORM ROOT ADMINISTRATION</span>
            {isConnected && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Radio className="size-3 animate-pulse" /> Live System Monitor
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {adminName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            System overview, role access management, and platform billing across DRONET.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/users"
            className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}
          >
            <Users className="size-4 text-primary" />
            <span>Manage Users</span>
          </Link>
          <Link
            href="/admin/shipments"
            className={buttonVariants({ size: "sm", className: "gap-1.5 font-semibold" })}
          >
            <Package className="size-4" />
            <span>All Shipments</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="TOTAL ACCOUNTS"
          value={isStatsLoading ? "..." : String(stats.totalUsers ?? 0)}
          trend="Registered on platform"
        />
        <StatCard
          label="ACTIVE PROVIDERS"
          value={isStatsLoading ? "..." : String(stats.providers ?? 0)}
          trend="Certified logistics partners"
        />
        <StatCard
          label="SHIPMENTS (30 DAYS)"
          value={isStatsLoading ? "..." : String(stats.shipmentsLast30Days ?? stats.shipments ?? 0)}
          trend="Automated delivery orders"
        />
        <StatCard
          label="PLATFORM REVENUE"
          value={isStatsLoading ? "..." : formatBDT(Number(stats.totalOnlinePayments ?? 0))}
          trend="Stripe & online gateways"
        />
      </div>

      {/* Management Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3 hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <Link
              href="/admin/users"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-0.5"
            >
              <span>Manage</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">User Management</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Audit customer and provider accounts, activate or suspend platform access.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3 hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Package className="size-5" />
            </div>
            <Link
              href="/admin/shipments"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-0.5"
            >
              <span>Audit</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Shipments Oversight</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Global parcel tracking across all zones, provider dispatch metrics.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3 hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <CreditCard className="size-5" />
            </div>
            <Link
              href="/admin/payments"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-0.5"
            >
              <span>Review</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Payment Reconciliation</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Verify Stripe transactions, customer payment confirmations, and refunds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
