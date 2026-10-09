import { getAllUsers, toggleUserStatus } from "@/api/user.api";
import type { UserRole } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function useGetAllUsers(params?: { role?: UserRole; searchTerm?: string }) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getAllUsers(params),
  });
}

export function useSuspenseGetAllUsers(params?: { role?: UserRole; searchTerm?: string }) {
  return useSuspenseQuery({
    queryKey: ["users", params],
    queryFn: () => getAllUsers(params),
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => toggleUserStatus(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
