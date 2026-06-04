"use client";

import { useCallback, useEffect } from "react";

import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient, signOut, updateUser, useSession as useBetterAuthSession } from "@/lib/auth/auth-client";
import { extractErrorMessage } from "@/lib/error-handler";

import { authService } from "./services";
import { useAuthStore } from "./store";
import type { LoginCredentials, RegisterData, User } from "./types";

// Utility to get redirect URL based on user role
function getRedirectUrl(user: User, callbackUrl?: string | null): string {
  if (user.role === "admin" || user.role === "vendor") {
    return "/dashboard";
  }
  // Customer: redirect to callback URL or marketplace
  return callbackUrl || "/";
}

// Hook to handle auth redirect with callback URL
export function useAuthRedirect() {
  const router = useRouter();

  const redirectToLogin = useCallback(
    (callbackUrl?: string) => {
      const url = callbackUrl ? `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/auth/login";
      router.push(url);
    },
    [router],
  );

  return { redirectToLogin };
}

// Hook session - utilise Better Auth pour la persistance automatique
export function useSession() {
  const { data: session, isPending } = useBetterAuthSession();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  const user = session?.user as User | undefined;

  // Sync Better Auth session with Zustand store
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user, setCurrentUser]);

  return {
    data: user ? { user } : null,
    isAuthenticated: !!user,
    isLoading: isPending,
  };
}

export function useLogin(callbackUrl?: string | null) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setCurrentUser(data.user);
      queryClient.setQueryData(["session"], data);
      toast.success("Connexion réussie");
      const redirectUrl = getRedirectUrl(data.user, callbackUrl);
      router.push(redirectUrl);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useRegister(callbackUrl?: string | null) {
  const router = useRouter();

  return useMutation({
    mutationFn: (registerData: RegisterData) => authService.register(registerData),
    onSuccess: (_, variables) => {
      // With email verification required, no session is returned immediately
      // Store password temporarily for auto-login after OTP verification
      sessionStorage.setItem("_bridge_pending_pw", variables.password);
      toast.success("Un code de vérification a été envoyé à votre email");
      router.push(`/auth/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useLogout(redirectTo = "/") {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async () => {
      await signOut();
      return { success: true };
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success("Déconnexion réussie");
      router.push(redirectTo);
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

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  return useMutation({
    mutationFn: async (data: { name: string; phone?: string }) => {
      const result = await updateUser({
        name: data.name,
        ...(data.phone ? { phone: data.phone } : {}),
      } as any);
      if (result.error) {
        throw new Error(result.error.message || "Erreur lors de la mise à jour du profil");
      }
      const profile = await authService.getProfile();
      return profile.user;
    },
    onSuccess: (user) => {
      setCurrentUser(user);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Profil mis à jour avec succès");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const result = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (result.error) {
        throw new Error(result.error.message || "Erreur lors du changement de mot de passe");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Mot de passe modifié avec succès");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}
