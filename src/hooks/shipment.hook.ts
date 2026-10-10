import {
  assignCourierToShipment,
  createShipment,
  getAllShipments,
  getAvailableCouriersForShipment,
  getShipmentById,
  simulateStatusUpdate,
  trackShipment,
} from "@/api/shipment.api";
import type { ShipmentQueryParams, ShipmentStatus } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function useGetAllShipments(params?: ShipmentQueryParams) {
  return useQuery({
    queryKey: ["shipments", params],
    queryFn: () => getAllShipments(params),
  });
}

export function useSuspenseGetAllShipments(params?: ShipmentQueryParams) {
  return useSuspenseQuery({
    queryKey: ["shipments", params],
    queryFn: () => getAllShipments(params),
  });
}

export function useGetShipmentById(id: string) {
  return useQuery({
    queryKey: ["shipment", id],
    queryFn: () => getShipmentById(id),
    enabled: !!id,
  });
}

export function useTrackShipment(trackingNumber: string) {
  const cleanNumber = trackingNumber ? trackingNumber.trim().toUpperCase() : "";
  return useQuery({
    queryKey: ["track", cleanNumber],
    queryFn: () => trackShipment(cleanNumber),
    enabled: !!cleanNumber,
  });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useAssignCourier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      courierId,
      pickupCourierId,
      deliveryCourierId,
    }: {
      id: string;
      courierId?: string;
      pickupCourierId?: string;
      deliveryCourierId?: string;
    }) =>
      assignCourierToShipment(id, {
        courierId,
        pickupCourierId,
        deliveryCourierId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["couriers"] });
    },
  });
}

export function useGetAvailableCouriers(shipmentId: string) {
  return useQuery({
    queryKey: ["available-couriers", shipmentId],
    queryFn: () => getAvailableCouriersForShipment(shipmentId),
    enabled: !!shipmentId,
  });
}

export function useSimulateStatusUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { shipmentId: string; nextStatus: ShipmentStatus }) =>
      simulateStatusUpdate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
