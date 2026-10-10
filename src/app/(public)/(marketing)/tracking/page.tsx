"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/modules/shared/status-badge";
import { useTrackShipment } from "@/hooks/shipment.hook";
import { useShipmentSocket } from "@/hooks/socket.hook";
import { formatBDT } from "@/lib/utils";
import {
  Search,
  Radio,
  MapPin,
  Clock,
  Bike,
  Package,
  Building,
  CheckCircle2,
  AlertCircle,
  Truck,
} from "lucide-react";
import type { ShipmentStatus } from "@/types";

const STATUS_STEPS: ShipmentStatus[] = [
  "CREATED",
  "PAYMENT_CONFIRMED",
  "COURIER_ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const initialNumber = searchParams.get("number") || "";

  const [inputNumber, setInputNumber] = useState(initialNumber);
  const [activeNumber, setActiveNumber] = useState(initialNumber);

  useEffect(() => {
    if (initialNumber) {
      setInputNumber(initialNumber);
      setActiveNumber(initialNumber);
    }
  }, [initialNumber]);

  const { data: trackRes, isLoading, isError } = useTrackShipment(activeNumber);

  // Subscribe to live Socket.io updates for this specific tracking number
  const { isConnected, latestEvent } = useShipmentSocket(activeNumber);

  const shipment = trackRes?.data;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputNumber.trim()) {
      setActiveNumber(inputNumber.trim().toUpperCase());
    }
  };

  const activeStatus: ShipmentStatus | undefined =
    latestEvent &&
    activeNumber &&
    latestEvent.trackingNumber?.trim().toUpperCase() ===
      activeNumber.trim().toUpperCase()
      ? latestEvent.status
      : shipment?.status;

  const currentStepIndex = activeStatus
    ? STATUS_STEPS.indexOf(activeStatus)
    : -1;

  const displayedEvents = useMemo(() => {
    if (!shipment?.events) return [];
    const list = [...shipment.events];
    if (
      latestEvent &&
      activeNumber &&
      latestEvent.trackingNumber?.trim().toUpperCase() ===
        activeNumber.trim().toUpperCase()
    ) {
      const exists = list.some((e) => e.status === latestEvent.status);
      if (!exists) {
        list.push({
          id: `latest-${latestEvent.status}`,
          shipmentId: latestEvent.shipmentId,
          status: latestEvent.status,
          description: latestEvent.description,
          createdAt:
            typeof latestEvent.timestamp === "string"
              ? latestEvent.timestamp
              : new Date().toISOString(),
        });
      }
    }
    return list;
  }, [shipment?.events, latestEvent, activeNumber]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Search Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-semibold">
          <Radio className="size-3.5 animate-pulse" />
          <span>REAL-TIME SATELLITE & DRONE TELEMETRY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Live Shipment Radar
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Enter your unique dispatch tracking number to view real-time drone coordinates and courier timeline.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              placeholder="e.g. TRK-ABCDE-12345"
              className="pl-9 font-mono text-xs uppercase"
              required
            />
          </div>
          <Button type="submit" className="font-semibold cursor-pointer">
            Track
          </Button>
        </form>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <Card className="p-8 text-center border-border/50 bg-card/60 backdrop-blur-md">
          <Radio className="size-8 animate-pulse text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">Querying logistics satellites...</p>
        </Card>
      )}

      {isError && activeNumber && !isLoading && (
        <Card className="p-8 text-center border-border/50 bg-card/60 backdrop-blur-md space-y-2">
          <AlertCircle className="size-8 text-red-400 mx-auto" />
          <h3 className="text-base font-bold text-foreground">Tracking Number Not Found</h3>
          <p className="text-xs text-muted-foreground">
            Could not locate any active shipment matching <span className="font-mono">{activeNumber}</span>.
          </p>
        </Card>
      )}

      {/* Live Tracking Result */}
      {shipment && !isLoading && (
        <div className="space-y-6">
          {/* Main Status Header Card */}
          <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-md shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-muted-foreground">Tracking ID:</span>
                  <span className="font-mono font-extrabold text-sm text-foreground">
                    {shipment.trackingNumber}
                  </span>
                  {isConnected && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <Radio className="size-2.5 animate-pulse" /> LIVE SYNC
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>Provider: {shipment.provider?.name || "DRONET Fleet"}</span>
                  <span>•</span>
                  <span>Weight: {shipment.weight} kg</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={activeStatus || shipment.status} />
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div
                      key={step}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        isCurrent
                          ? "bg-primary/15 border-primary text-primary font-bold shadow-sm"
                          : isDone
                          ? "bg-muted/40 border-border/40 text-foreground"
                          : "bg-muted/10 border-border/20 text-muted-foreground/50"
                      }`}
                    >
                      <div className="text-[10px] font-mono mb-1">0{idx + 1}</div>
                      <div className="text-[10px] uppercase font-semibold leading-tight">
                        {step.replace(/_/g, " ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Route & Destination Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                  <MapPin className="size-3.5" />
                  <span>Pickup Location (Sender)</span>
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-foreground">{shipment.senderName}</div>
                  <div className="text-muted-foreground">{shipment.senderAddress}</div>
                  <div className="text-[11px] font-mono text-muted-foreground mt-1">
                    {shipment.senderPhone}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <MapPin className="size-3.5" />
                  <span>Delivery Destination (Receiver)</span>
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-foreground">{shipment.receiverName}</div>
                  <div className="text-muted-foreground">{shipment.receiverAddress}</div>
                  <div className="text-[11px] font-mono text-muted-foreground mt-1">
                    {shipment.receiverPhone}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Courier & Telemetry Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Courier Card */}
            <Card className="p-5 border-border/50 bg-card space-y-3.5 h-fit">
              <div className="flex items-center gap-2 border-b border-border/30 pb-2.5">
                <Bike className="size-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Assigned Courier
                </h3>
              </div>

              {shipment.deliveryCourier || shipment.pickupCourier ? (
                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-foreground">
                    {shipment.deliveryCourier?.name || shipment.pickupCourier?.name}
                  </div>
                  <div className="text-muted-foreground font-mono">
                    {shipment.deliveryCourier?.phone || shipment.pickupCourier?.phone}
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="size-3" />
                    <span>Dispatched in designated zone</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground italic">
                  Awaiting courier dispatch from hub.
                </div>
              )}
            </Card>

            {/* Event Log Timeline */}
            <Card className="md:col-span-2 p-5 border-border/50 bg-card space-y-4">
              <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Live Dispatch Timeline
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {displayedEvents.length} Events Recorded
                </span>
              </div>

              <div className="space-y-4">
                {displayedEvents.length === 0 ? (
                  <div className="text-xs text-muted-foreground italic py-4 text-center">
                    Initial dispatch record created.
                  </div>
                ) : (
                  displayedEvents.map((ev, i) => (
                    <div key={ev.id || i} className="flex gap-3 text-xs">
                      <div className="flex flex-col items-center">
                        <div className="size-2.5 rounded-full bg-primary mt-1" />
                        {i < displayedEvents.length - 1 && (
                          <div className="w-0.5 flex-1 bg-border/60 my-1" />
                        )}
                      </div>
                      <div className="space-y-0.5 flex-1 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">
                            {ev.status.replace(/_/g, " ")}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {new Date(ev.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[11px]">
                          {ev.description || "Status updated in logistics ledger."}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
