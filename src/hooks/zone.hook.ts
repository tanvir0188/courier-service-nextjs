import { createZone, getAllZones } from "@/api/zone.api";
import type { CreateZonePayload } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function useGetAllZones() {
  return useQuery({
    queryKey: ["zones"],
    queryFn: getAllZones,
  });
}

export function useSuspenseGetAllZones() {
  return useSuspenseQuery({
    queryKey: ["zones"],
    queryFn: getAllZones,
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
