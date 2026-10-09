import { getDashboardStats } from "@/api/stats.api";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export function useGetDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });
}

export function useSuspenseGetDashboardStats() {
  return useSuspenseQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });
}
