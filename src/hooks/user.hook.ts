import { getAllUsers, toggleUserStatus, updateProfile } from "@/api/user.api";
import type { UserRole } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function useGetAllUsers(params?: {
  role?: UserRole;
  searchTerm?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getAllUsers(params),
  });
}

export function useSuspenseGetAllUsers(params?: {
  role?: UserRole;
  searchTerm?: string;
  page?: number;
  limit?: number;
}) {
  return useSuspenseQuery({
    queryKey: ["users", params],
    queryFn: () => getAllUsers(params),
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive?: boolean }) =>
      toggleUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
