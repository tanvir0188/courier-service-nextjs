import { createZone, deleteZone, getAllZones, getZoneById, updateZone } from "@/api/zone.api";
import type { CreateZonePayload } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function useGetAllZones(params?: { searchTerm?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["zones", params],
    queryFn: () => getAllZones(params),
  });
}

export function useSuspenseGetAllZones(params?: { searchTerm?: string; page?: number; limit?: number }) {
  return useSuspenseQuery({
    queryKey: ["zones", params],
    queryFn: () => getAllZones(params),
  });
}

export function useGetZoneById(id: string) {
  return useQuery({
    queryKey: ["zone", id],
    queryFn: () => getZoneById(id),
    enabled: !!id,
  });
}

export function useCreateZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateZonePayload) => createZone(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
}

export function useUpdateZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name: string } }) =>
      updateZone(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
}

export function useDeleteZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
}
