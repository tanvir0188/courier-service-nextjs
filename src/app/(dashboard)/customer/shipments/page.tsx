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
import { Button, buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/modules/shared/status-badge";
import { useGetAllShipments } from "@/hooks/shipment.hook";
import { useCreateCheckoutSession } from "@/hooks/payment.hook";
import { useShipmentSocket } from "@/hooks/socket.hook";
import { formatBDT } from "@/lib/utils";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiClient";
import {
  Package,
  Search,
  ExternalLink,
  CreditCard,
  Plus,
  Radio,
} from "lucide-react";
import type { ShipmentStatus } from "@/types";

export default function CustomerShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ShipmentStatus | "ALL">("ALL");

  const { data: shipmentsRes, isLoading } = useGetAllShipments({
    searchTerm: searchTerm || undefined,
    status: selectedStatus === "ALL" ? undefined : selectedStatus,
  });

  const { isConnected } = useShipmentSocket();
  const checkoutMutation = useCreateCheckoutSession();

  const shipments = shipmentsRes?.data || [];

  const handlePay = (shipmentId: string) => {
    checkoutMutation.mutate(
      {
        shipmentId,
        successUrl: `${window.location.origin}/payment/verify?sessionId={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/customer/shipments`,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.url) {
            window.location.href = res.data.url;
          } else {
            toast.error("Unable to generate Stripe checkout URL");
          }
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to start checkout."));
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-primary tracking-wider uppercase mb-1">
            <span>// MY SHIPMENTS</span>
            {isConnected && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Radio className="size-3 animate-pulse" /> Live Socket Sync
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Shipment History
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your outgoing drone deliveries and track active dispatches.
          </p>
        </div>
        <Link
          href="/customer/new"
          className={buttonVariants({ className: "font-semibold shadow-md shrink-0 gap-1.5" })}
        >
          <Plus className="size-4" />
          <span>New shipment</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by tracking number, receiver, or address..."
            className="pl-9 text-xs"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring sm:w-[180px]"
        >
          <option value="ALL" className="bg-background text-foreground">
            All Statuses
          </option>
          <option value="CREATED" className="bg-background text-foreground">
            Created (Unpaid)
          </option>
          <option value="PAYMENT_CONFIRMED" className="bg-background text-foreground">
            Payment Confirmed
          </option>
          <option value="COURIER_ASSIGNED" className="bg-background text-foreground">
            Courier Assigned
          </option>
          <option value="PICKED_UP" className="bg-background text-foreground">
            Picked Up
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
              <TableHead className="text-xs font-mono">DESTINATION</TableHead>
              <TableHead className="text-xs font-mono">RECEIVER</TableHead>
              <TableHead className="text-xs font-mono">WEIGHT</TableHead>
              <TableHead className="text-xs font-mono">STATUS</TableHead>
              <TableHead className="text-xs font-mono text-right">AMOUNT</TableHead>
              <TableHead className="text-right text-xs font-mono w-[160px]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-sm">
                  Fetching your shipments...
                </TableCell>
              </TableRow>
            ) : shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Package className="size-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No matching shipments found
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
                    <span className="truncate max-w-[200px] block">
                      {s.receiverAddress}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-foreground">
                    <div className="font-medium">{s.receiverName}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {s.receiverPhone}
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
                    <div className="flex items-center justify-end gap-1.5">
                      {s.status === "CREATED" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handlePay(s.id)}
                          disabled={checkoutMutation.isPending}
                          className="h-7 text-[11px] gap-1 px-2 cursor-pointer bg-primary text-primary-foreground font-semibold"
                        >
                          <CreditCard className="size-3" />
                          <span>Pay</span>
                        </Button>
                      )}
                      <Link
                        href={`/tracking?number=${encodeURIComponent(s.trackingNumber)}`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "h-7 text-[11px] gap-1 px-2 cursor-pointer",
                        })}
                      >
                        <ExternalLink className="size-3" />
                        <span>Track</span>
                      </Link>
                    </div>
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
