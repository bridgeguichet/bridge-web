import { create } from "zustand";

import type { User } from "./types";

interface AuthStore {
  currentUser: User | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  setCurrentUser: (user) =>
    set({
      currentUser: user,
      isAuthenticated: !!user,
    }),
  clearAuth: () =>
    set({
      currentUser: null,
      isAuthenticated: false,
    }),
}));
