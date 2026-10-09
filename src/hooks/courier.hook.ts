import {
  createCourier,
  deleteCourier,
  getAllCouriers,
  getCourierById,
  updateCourier,
} from "@/api/courier.api";
import type { CreateCourierPayload, UpdateCourierPayload } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function useGetAllCouriers(params?: { zoneId?: string; status?: string }) {
  return useQuery({
    queryKey: ["couriers", params],
    queryFn: () => getAllCouriers(params),
  });
}

export function useSuspenseGetAllCouriers(params?: { zoneId?: string; status?: string }) {
  return useSuspenseQuery({
    queryKey: ["couriers", params],
    queryFn: () => getAllCouriers(params),
  });
}

export function useGetCourierById(id: string) {
  return useQuery({
    queryKey: ["courier", id],
    queryFn: () => getCourierById(id),
    enabled: !!id,
  });
}

export function useCreateCourier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCourierPayload) => createCourier(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["couriers"] });
    },
  });
}

export function useUpdateCourier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCourierPayload }) =>
      updateCourier(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["couriers"] });
    },
  });
}

export function useDeleteCourier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCourier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["couriers"] });
    },
  });
}
