import { io, type Socket } from "socket.io-client";
import config from "@/config/config";
import type { ShipmentStatus } from "@/types";

export interface ShipmentStatusUpdateEvent {
  shipmentId: string;
  trackingNumber: string;
  status: ShipmentStatus;
  description: string;
  timestamp: string | Date;
  senderZone?: string;
  receiverZone?: string;
  courierName?: string | null;
}

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (typeof window === "undefined") {
    return null as any;
  }

  if (!socket) {
    const socketUrl = config.socket_url || "http://localhost:8787";
    socket = io(socketUrl, {
      transports: ["polling", "websocket"],
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log(`[Socket.io] Connected successfully to ${socketUrl} (${socket?.id})`);
    });

    socket.on("connect_error", (err) => {
      console.warn("[Socket.io] Connection warning:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket.io] Disconnected:", reason);
    });
  }

  return socket;
};

export const joinShipmentRoom = (trackingNumber: string): void => {
  const s = getSocket();
  if (s && trackingNumber) {
    s.emit("join:shipment", trackingNumber.trim().toUpperCase());
  }
};

export const leaveShipmentRoom = (trackingNumber: string): void => {
  const s = getSocket();
  if (s && trackingNumber) {
    s.emit("leave:shipment", trackingNumber.trim().toUpperCase());
  }
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
