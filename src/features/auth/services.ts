import axios from "axios";

import type { LoginCredentials, LoginResponse, ProfileResponse, RegisterData, User } from "./types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await axios.post("/api/auth/login", credentials, {
      withCredentials: true,
    });

    if (data.error) {
      throw new Error(data.error || "Erreur lors de la connexion");
    }

    return {
      success: true,
      user: data.user as User,
    };
  },

  register: async (registerData: RegisterData): Promise<LoginResponse> => {
    const { data } = await axios.post("/api/auth/register", registerData, {
      withCredentials: true,
    });

    if (data.error) {
      throw new Error(data.error || "Erreur lors de l'inscription");
    }

    return {
      success: true,
      user: data.user as User,
    };
  },

  logout: async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    return { success: true };
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const { data } = await axios.get("/api/auth/profile", {
      withCredentials: true,
    });
    if (!data.user) {
      throw new Error("Non authentifié");
    }
    return { user: data.user as User };
  },

  refresh: async (): Promise<{ success: boolean }> => {
    const { data } = await axios.post(
      "/api/auth/refresh",
      {},
      {
        withCredentials: true,
      },
    );
    return { success: data.success };
  },

  // Google OAuth
  signInWithGoogle: async () => {
    // TODO: Implement Google OAuth via API routes
    throw new Error("Google OAuth not yet implemented with API routes");
  },

  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return {
        valid: false,
        message: "Le mot de passe doit contenir au moins 8 caractères",
      };
    }

    return { valid: true };
  },
};
