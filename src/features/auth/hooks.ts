"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useSession as useBetterSession } from "@/lib/auth/auth-client";
import { extractErrorMessage } from "@/lib/error-handler";

import { authService } from "./services";
import { useAuthStore } from "./store";
import type { LoginCredentials, RegisterData } from "./types";

// Hook session Better Auth
export function useSession() {
  return useBetterSession();
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      setCurrentUser(data.user);
      queryClient.setQueryData(["session"], data);
      toast.success("Connexion réussie");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  return useMutation({
    mutationFn: (registerData: RegisterData) =>
      authService.register(registerData),
    onSuccess: (data) => {
      setCurrentUser(data.user);
      queryClient.setQueryData(["session"], data);
      toast.success("Compte créé avec succès");
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
      const response = await authService.getProfile();
      setCurrentUser(response.user);
      return response;
    },
    enabled,
  });
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: () => authService.signInWithGoogle(),
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}
