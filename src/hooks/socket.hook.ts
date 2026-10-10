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

    const updateTrackingCache = (event: ShipmentStatusUpdateEvent) => {
      const cleanEventNumber = event.trackingNumber?.trim().toUpperCase();

      queryClient.setQueriesData(
        { queryKey: ["track"] },
        (old: any) => {
          if (!old?.data) return old;
          const current = old.data;
          const currentNumber = current.trackingNumber?.trim().toUpperCase();
          if (cleanEventNumber && currentNumber !== cleanEventNumber) {
            return old;
          }

          const existingEvents = current.events ? [...current.events] : [];
          const hasEvent = existingEvents.some(
            (e: any) => e.status === event.status
          );

          if (!hasEvent) {
            existingEvents.push({
              id: `live-${Date.now()}`,
              shipmentId: event.shipmentId,
              status: event.status,
              description: event.description,
              createdAt:
                typeof event.timestamp === "string"
                  ? event.timestamp
                  : new Date().toISOString(),
            });
          }

          return {
            ...old,
            data: {
              ...current,
              status: event.status,
              events: existingEvents,
            },
          };
        }
      );
    };

    // Event listener for room-specific updates
    const handleStatusUpdated = (event: ShipmentStatusUpdateEvent) => {
      setLatestEvent(event);
      toast.info(`Shipment ${event.trackingNumber} is now ${event.status.replace(/_/g, " ")}`);

      updateTrackingCache(event);

      // Invalidate relevant TanStack queries for seamless live UI refresh
      queryClient.invalidateQueries({ queryKey: ["track"] });
      queryClient.invalidateQueries({ queryKey: ["tracking"] });
      queryClient.invalidateQueries({ queryKey: ["shipment"] });
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

      const cleanWatching = trackingNumber?.trim().toUpperCase();
      const cleanEvent = event.trackingNumber?.trim().toUpperCase();

      // If user is actively watching this specific tracking number
      if (cleanWatching && cleanEvent === cleanWatching) {
        setLatestEvent(event);
        updateTrackingCache(event);
        queryClient.invalidateQueries({ queryKey: ["track"] });
        queryClient.invalidateQueries({ queryKey: ["tracking"] });
        queryClient.invalidateQueries({ queryKey: ["shipment"] });
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("shipment:status_updated", handleStatusUpdated);
    socket.on("shipment:live_update", handleLiveUpdate);

    const cleanRoomNumber = trackingNumber?.trim().toUpperCase();

    // Join tracking room if trackingNumber provided
    if (cleanRoomNumber) {
      joinShipmentRoom(cleanRoomNumber);
    }

    return () => {
      if (cleanRoomNumber) {
        leaveShipmentRoom(cleanRoomNumber);
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
