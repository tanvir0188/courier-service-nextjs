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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogin,
    onSuccess: (res) => {
      if (res?.data?.accessToken) {
        localStorage.setItem("access_token", res.data.accessToken);
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
        localStorage.setItem("access_token", res.data.accessToken);
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
        localStorage.setItem("access_token", res.data.accessToken);
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
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
