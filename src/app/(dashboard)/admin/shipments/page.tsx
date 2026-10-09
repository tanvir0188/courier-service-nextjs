"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/modules/shared/status-badge";
import { useGetAllShipments } from "@/hooks/shipment.hook";
import { useShipmentSocket } from "@/hooks/socket.hook";
import { formatBDT } from "@/lib/utils";
import {
  Package,
  Search,
  ExternalLink,
  Radio,
  Building,
} from "lucide-react";
import type { ShipmentStatus } from "@/types";

export default function AdminShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ShipmentStatus | "ALL">("ALL");

  const { data: shipmentsRes, isLoading } = useGetAllShipments({
    searchTerm: searchTerm || undefined,
    status: selectedStatus === "ALL" ? undefined : selectedStatus,
  });

  const { isConnected } = useShipmentSocket();
  const shipments = shipmentsRes?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-primary tracking-wider uppercase mb-1">
          <span>// GLOBAL SHIPMENT REGISTRY</span>
          {isConnected && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Radio className="size-3 animate-pulse" /> Live System Telemetry
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Platform Shipments
        </h1>
        <p className="text-xs text-muted-foreground">
          Real-time oversight of all parcel routes, provider dispatches, and drone drops.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by tracking number, sender, or receiver..."
            className="pl-9 text-xs"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring sm:w-[200px]"
        >
          <option value="ALL" className="bg-background text-foreground">
            All Statuses
          </option>
          <option value="CREATED" className="bg-background text-foreground">
            Created
          </option>
          <option value="PAYMENT_CONFIRMED" className="bg-background text-foreground">
            Payment Confirmed
          </option>
          <option value="COURIER_ASSIGNED" className="bg-background text-foreground">
            Courier Assigned
          </option>
          <option value="IN_TRANSIT" className="bg-background text-foreground">
            In Transit
          </option>
          <option value="OUT_FOR_DELIVERY" className="bg-background text-foreground">
            Out for Delivery
          </option>
          <option value="DELIVERED" className="bg-background text-foreground">
            Delivered
          </option>
          <option value="CANCELLED" className="bg-background text-foreground">
            Cancelled
          </option>
        </select>
      </div>

      {/* Shipments Table */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[140px] text-xs font-mono">TRACKING</TableHead>
              <TableHead className="text-xs font-mono">PROVIDER</TableHead>
              <TableHead className="text-xs font-mono">SENDER</TableHead>
              <TableHead className="text-xs font-mono">RECEIVER</TableHead>
              <TableHead className="text-xs font-mono">STATUS</TableHead>
              <TableHead className="text-right text-xs font-mono">TOTAL FEE</TableHead>
              <TableHead className="text-right text-xs font-mono w-[80px]">TRACK</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-sm">
                  Loading global shipments...
                </TableCell>
              </TableRow>
            ) : shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Package className="size-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No matching shipments recorded
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
                    <div className="flex items-center gap-1 font-medium">
                      <Building className="size-3 text-muted-foreground" />
                      <span>{s.provider?.name || "Provider"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-foreground">
                    <div>
                      <div className="font-medium">{s.senderName}</div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[130px]">
                        {s.senderAddress}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-foreground">
                    <div>
                      <div className="font-medium">{s.receiverName}</div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[130px]">
                        {s.receiverAddress}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={s.status} />
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono font-bold text-foreground">
                    {formatBDT(Number(s.totalAmount || s.deliveryFee))}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/tracking?number=${encodeURIComponent(s.trackingNumber)}`}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                        className: "h-7 w-7 p-0 cursor-pointer text-primary",
                      })}
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
  );
}
