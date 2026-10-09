"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getSocket,
  joinShipmentRoom,
  leaveShipmentRoom,
  type ShipmentStatusUpdateEvent,
} from "@/lib/socket";
import { toast } from "sonner";

export function useShipmentSocket(
  trackingNumber?: string,
  onUpdate?: (event: ShipmentStatusUpdateEvent) => void
) {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [latestEvent, setLatestEvent] = useState<ShipmentStatusUpdateEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const socket = getSocket();
    if (!socket) return;

    setIsConnected(socket.connected);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    // Event listener for room-specific updates
    const handleStatusUpdated = (event: ShipmentStatusUpdateEvent) => {
      setLatestEvent(event);
      toast.info(`Shipment ${event.trackingNumber} is now ${event.status.replace(/_/g, " ")}`);

      // Invalidate relevant TanStack queries for seamless live UI refresh
      queryClient.invalidateQueries({ queryKey: ["tracking", event.trackingNumber] });
      queryClient.invalidateQueries({ queryKey: ["shipment", event.shipmentId] });
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

      if (onUpdate) {
        onUpdate(event);
      }
    };

    // Broadcast live update across dashboard channels
    const handleLiveUpdate = (event: ShipmentStatusUpdateEvent) => {
      // Refresh list queries in background
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

      // If user is actively watching this specific tracking number
      if (trackingNumber && event.trackingNumber.toUpperCase() === trackingNumber.toUpperCase()) {
        setLatestEvent(event);
        queryClient.invalidateQueries({ queryKey: ["tracking", trackingNumber] });
        queryClient.invalidateQueries({ queryKey: ["shipment", event.shipmentId] });
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("shipment:status_updated", handleStatusUpdated);
    socket.on("shipment:live_update", handleLiveUpdate);

    // Join tracking room if trackingNumber provided
    if (trackingNumber) {
      joinShipmentRoom(trackingNumber);
    }

    return () => {
      if (trackingNumber) {
        leaveShipmentRoom(trackingNumber);
      }
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("shipment:status_updated", handleStatusUpdated);
      socket.off("shipment:live_update", handleLiveUpdate);
    };
  }, [trackingNumber, queryClient, onUpdate]);

  return {
    isConnected,
    latestEvent,
  };
}
