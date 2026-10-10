import {
  forgotPassword,
  getMe,
  googleOAuth,
  resetPassword,
  userLogin,
  userLogout,
  userRegistration,
  verifyEmail,
} from "@/api";
import { getAuthRole, getAuthToken, setAuthCookies } from "@/lib/auth-cookies";
import { logout } from "@/service/logout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogin,
    onSuccess: (res) => {
      if (res?.data?.accessToken) {
        setAuthCookies(
          res.data.accessToken,
          undefined,
          res.data.user?.role
        );
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (res) => {
      if (res?.data?.accessToken) {
        setAuthCookies(
          res.data.accessToken,
          undefined,
          res.data.user?.role
        );
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useGoogleOAuth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: googleOAuth,
    onSuccess: (res) => {
      if (res?.data?.accessToken) {
        setAuthCookies(
          res.data.accessToken,
          undefined,
          res.data.user?.role
        );
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      userLogout();
      await logout();
    },
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries();
    },
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = typeof window !== "undefined" ? getAuthToken() : undefined;
      if (token?.startsWith("demo_")) {
        const role = getAuthRole() || "CUSTOMER";
        return {
          success: true,
          data: {
            id: "demo-user-id",
            name: `${role} Demo User`,
            email: `${role.toLowerCase()}@dronet.io`,
            role,
            phone: "+8801700000000",
          },
        };
      }
      return getMe();
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
