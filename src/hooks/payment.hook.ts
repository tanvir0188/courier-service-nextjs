import {
  createCheckoutSession,
  getAllPayments,
  getPaymentByShipmentId,
  verifyCheckoutSession,
} from "@/api/payment.api";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function useGetAllPayments(params?: {
  page?: number;
  limit?: number;
  gateway?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getAllPayments(params),
  });
}

export function useSuspenseGetAllPayments(params?: {
  page?: number;
  limit?: number;
  gateway?: string;
  status?: string;
}) {
  return useSuspenseQuery({
    queryKey: ["payments", params],
    queryFn: () => getAllPayments(params),
  });
}

export function useGetPaymentByShipment(shipmentId: string) {
  return useQuery({
    queryKey: ["payment", shipmentId],
    queryFn: () => getPaymentByShipmentId(shipmentId),
    enabled: !!shipmentId,
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (shipmentId: string) => createCheckoutSession({ shipmentId }),
  });
}

export function useVerifyCheckoutSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => verifyCheckoutSession({ sessionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}
