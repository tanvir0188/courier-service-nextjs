import { getDashboardStats } from "@/api/stats.api";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export function useGetDashboardStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getDashboardStats,
  });
}

export function useSuspenseGetDashboardStats() {
  return useSuspenseQuery({
    queryKey: ["stats"],
    queryFn: getDashboardStats,
  });
}
