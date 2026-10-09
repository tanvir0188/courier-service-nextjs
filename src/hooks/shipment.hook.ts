import {
  assignCourierToShipment,
  createShipment,
  getAllShipments,
  getAvailableCouriersForShipment,
  getShipmentById,
  trackShipment,
} from "@/api/shipment.api";
import type { ShipmentQueryParams } from "@/types";
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
  return useQuery({
    queryKey: ["track", trackingNumber],
    queryFn: () => trackShipment(trackingNumber),
    enabled: !!trackingNumber,
  });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useAssignCourier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      courierId,
      type,
    }: {
      id: string;
      courierId: string;
      type: "PICKUP" | "DELIVERY";
    }) => assignCourierToShipment(id, { courierId, type }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
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
