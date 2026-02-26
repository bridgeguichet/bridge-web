import axios from "axios";

import axiosInstance from "@/lib/axios";

import type { LoginCredentials, LoginResponse, LogoutResponse, ProfileResponse, RefreshResponse, User } from "./types";

const authApiClient = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await authApiClient.post<LoginResponse>("/login", credentials);
    return data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const { data } = await authApiClient.post<LogoutResponse>("/logout");
    return data;
  },

  refresh: async (): Promise<RefreshResponse> => {
    const { data } = await authApiClient.post<RefreshResponse>("/token/refresh");
    return data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const { data } = await axiosInstance.get<User>("/api/auth/profile/");
    return { user: data };
  },

  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (password: string): { valid: boolean; message?: string } => {
    if (password.length < 6) {
      return {
        valid: false,
        message: "Le mot de passe doit contenir au moins 6 caractères",
      };
    }

    return { valid: true };
  },
};
