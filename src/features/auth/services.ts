import { authClient } from "@/lib/auth/auth-client";

import type {
  LoginCredentials,
  LoginResponse,
  ProfileResponse,
  RegisterData,
  User,
} from "./types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data, error } = await authClient.signIn.email({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message || "Erreur lors de la connexion");
    }

    return {
      success: true,
      user: data?.user as User,
    };
  },

  register: async (registerData: RegisterData): Promise<LoginResponse> => {
    const { data, error } = await authClient.signUp.email({
      email: registerData.email,
      password: registerData.password,
      name: registerData.name,
    });

    if (error) {
      throw new Error(error.message || "Erreur lors de l'inscription");
    }

    return {
      success: true,
      user: data?.user as User,
    };
  },

  logout: async () => {
    await authClient.signOut();
    return { success: true };
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const { data: session } = await authClient.getSession();
    if (!session?.user) {
      throw new Error("Non authentifié");
    }
    return { user: session.user as User };
  },

  // Google OAuth
  signInWithGoogle: async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  },

  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (
    password: string,
  ): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return {
        valid: false,
        message: "Le mot de passe doit contenir au moins 8 caractères",
      };
    }

    return { valid: true };
  },
};
