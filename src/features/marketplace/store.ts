"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesStore {
  ids: string[];
  userId: string | null;
  setUserId: (userId: string | null) => void;
  toggle: (serviceId: string) => void;
  isLiked: (serviceId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      ids: [],
      userId: null,
      setUserId: (userId) => {
        const currentUserId = get().userId;
        if (currentUserId !== userId) {
          set({ userId, ids: [] });
        }
      },
      toggle: (serviceId) =>
        set((state) => ({
          ids: state.ids.includes(serviceId) ? state.ids.filter((id) => id !== serviceId) : [...state.ids, serviceId],
        })),
      isLiked: (serviceId) => get().ids.includes(serviceId),
    }),
    { name: "bridge-favorites" },
  ),
);
