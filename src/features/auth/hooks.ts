"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { extractErrorMessage } from "@/lib/error-handler";

import { authService } from "./services";
import { useAuthStore } from "./store";
import type { LoginCredentials } from "./types";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setCurrentUser(data.user);
      queryClient.setQueryData(["profile"], data.user);
      toast.success("Connexion réussie");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success("Déconnexion réussie");
      router.push("/auth/login");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useProfile(enabled = true) {
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const data = await authService.getProfile();
      setCurrentUser(data.user);
      return data.user;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled,
  });
}
