"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/modules/shared/status-badge";
import {
  useGetAllShipments,
  useGetAvailableCouriers,
  useAssignCourier,
  useSimulateStatusUpdate,
} from "@/hooks/shipment.hook";
import { useShipmentSocket } from "@/hooks/socket.hook";
import { formatBDT } from "@/lib/utils";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiClient";
import {
  Package,
  Search,
  Bike,
  Radio,
  UserCheck,
  FastForward,
  Check,
  X,
} from "lucide-react";
import type { Shipment, ShipmentStatus } from "@/types";

export default function ProviderShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ShipmentStatus | "ALL">("ALL");

  const { data: shipmentsRes, isLoading } = useGetAllShipments({
    searchTerm: searchTerm || undefined,
    status: selectedStatus === "ALL" ? undefined : selectedStatus,
  });

  const { isConnected } = useShipmentSocket();

  // Courier Assignment Modal State
  const [assignModalShipment, setAssignModalShipment] = useState<Shipment | null>(null);
  const [selectedCourierId, setSelectedCourierId] = useState("");

  const { data: availableCouriersRes, isLoading: isLoadingCouriers } =
    useGetAvailableCouriers(assignModalShipment?.id || "");

  const assignCourierMutation = useAssignCourier();
  const simulateStatusMutation = useSimulateStatusUpdate();

  const shipments = shipmentsRes?.data || [];
  const availableCouriers = useMemo(() => {
    const rawData = availableCouriersRes?.data as any;
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData;

    const list = [
      ...(rawData.pickupCouriers || []),
      ...(rawData.deliveryCouriers || []),
    ];
    const seen = new Set<string>();
    return list.filter((c: any) => {
      if (!c?.id || seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [availableCouriersRes?.data]);

  const handleAssignCourier = () => {
    if (!assignModalShipment || !selectedCourierId) {
      toast.error("Please pick a courier from the list");
      return;
    }

    assignCourierMutation.mutate(
      {
        id: assignModalShipment.id,
        courierId: selectedCourierId,
      },
      {
        onSuccess: () => {
          toast.success("Courier assigned successfully!");
          setAssignModalShipment(null);
          setSelectedCourierId("");
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to assign courier."));
        },
      }
    );
  };

  const getNextStatus = (current: ShipmentStatus): ShipmentStatus | null => {
    switch (current) {
      case "COURIER_ASSIGNED":
        return "PICKED_UP";
      case "PICKED_UP":
        return "IN_TRANSIT";
      case "IN_TRANSIT":
        return "OUT_FOR_DELIVERY";
      case "OUT_FOR_DELIVERY":
        return "DELIVERED";
      default:
        return null;
    }
  };

  const handleAdvanceStatus = (shipmentId: string, nextStatus: ShipmentStatus) => {
    simulateStatusMutation.mutate(
      {
        shipmentId,
        nextStatus,
      },
      {
        onSuccess: () => {
          toast.success(`Shipment advanced to ${nextStatus.replace(/_/g, " ")}`);
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to advance shipment status."));
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
            <span>// DISPATCH & COURIER ASSIGNMENTS</span>
            {isConnected && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Radio className="size-3 animate-pulse" /> Live Telemetry
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Provider Shipments
          </h1>
          <p className="text-xs text-muted-foreground">
            Assign delivery personnel and advance parcel progress through the network.
          </p>
        </div>
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
          <option value="PAYMENT_CONFIRMED" className="bg-background text-foreground">
            Awaiting Courier
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
        </select>
      </div>

      {/* Shipments Table */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[140px] text-xs font-mono">TRACKING</TableHead>
              <TableHead className="text-xs font-mono">SENDER</TableHead>
              <TableHead className="text-xs font-mono">RECEIVER</TableHead>
              <TableHead className="text-xs font-mono">STATUS</TableHead>
              <TableHead className="text-xs font-mono">COURIER</TableHead>
              <TableHead className="text-right text-xs font-mono w-[220px]">DISPATCH ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-sm">
                  Loading dispatch operations...
                </TableCell>
              </TableRow>
            ) : shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Package className="size-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No matching shipments
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              shipments.map((s) => {
                const next = getNextStatus(s.status);
                const assignedCourier = s.deliveryCourier?.name || s.pickupCourier?.name;

                return (
                  <TableRow key={s.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-bold text-foreground">
                      {s.trackingNumber}
                    </TableCell>
                    <TableCell className="text-xs text-foreground">
                      <div>
                        <div className="font-medium">{s.senderName}</div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                          {s.senderAddress}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-foreground">
                      <div>
                        <div className="font-medium">{s.receiverName}</div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                          {s.receiverAddress}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={s.status} />
                    </TableCell>
                    <TableCell className="text-xs">
                      {assignedCourier ? (
                        <div className="flex items-center gap-1 font-medium text-foreground">
                          <Bike className="size-3.5 text-primary" />
                          <span>{assignedCourier}</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAssignModalShipment(s);
                            setSelectedCourierId("");
                          }}
                          className="h-7 text-[11px] gap-1 px-2 cursor-pointer border-dashed"
                        >
                          <UserCheck className="size-3 text-primary" />
                          <span>Assign</span>
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Status Advancement / Simulation */}
                        {next && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleAdvanceStatus(s.id, next)}
                            disabled={simulateStatusMutation.isPending}
                            className="h-7 text-[11px] gap-1 px-2 cursor-pointer bg-primary/10 text-primary hover:bg-primary/20"
                            title={`Advance to ${next}`}
                          >
                            <FastForward className="size-3" />
                            <span>{next.replace(/_/g, " ")}</span>
                          </Button>
                        )}
                        {!assignedCourier && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              setAssignModalShipment(s);
                              setSelectedCourierId("");
                            }}
                            className="h-7 text-[11px] gap-1 px-2 cursor-pointer"
                          >
                            <Bike className="size-3" />
                            <span>Courier</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Courier Assignment Dialog / Overlay */}
      {assignModalShipment && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-border/50 bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Assign Courier</h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {assignModalShipment.trackingNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssignModalShipment(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-muted-foreground">
                Route: {assignModalShipment.senderAddress} ➔ {assignModalShipment.receiverAddress}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Available Fleet Personnel
                </label>
                <select
                  value={selectedCourierId}
                  onChange={(e) => setSelectedCourierId(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="" disabled className="bg-background text-foreground">
                    {isLoadingCouriers ? "Scanning couriers..." : "Choose courier to dispatch"}
                  </option>
                  {availableCouriers.map((c: any) => (
                    <option key={c.id} value={c.id} className="bg-background text-foreground">
                      {c.name} ({c.phone}) - {c.zoneName ? `${c.zoneName} · ` : ""}{c.status}
                    </option>
                  ))}
                </select>
                {availableCouriers.length === 0 && !isLoadingCouriers && (
                  <p className="text-[11px] text-amber-400">
                    No active couriers found in this zone. You can create one in Courier Management.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/30">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAssignModalShipment(null)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAssignCourier}
                disabled={assignCourierMutation.isPending || !selectedCourierId}
                className="gap-1.5 cursor-pointer font-semibold"
              >
                <Check className="size-3.5" />
                <span>{assignCourierMutation.isPending ? "Assigning..." : "Confirm Assignment"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
