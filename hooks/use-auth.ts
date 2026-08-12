"use client";
import { usersApi } from "@/api/users";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi, type LoginPayload, type RegisterPayload } from "@/api/auth";
import { getApiErrorMessage } from "@/api/client";

export function useCurrentUser() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["me"],
    queryFn: usersApi.me,
    enabled: !!accessToken,
    staleTime: 60_000,
  });
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setAuth(data);
      queryClient.setQueryData(["me"], data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.signup(payload),
    onSuccess: (data) => {
      setAuth(data);
      queryClient.setQueryData(["me"], data.user);
      toast.success("Account created successfully!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      toast.success("Logged out");
    },
  });
}
