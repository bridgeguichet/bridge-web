"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { PackItemWithDetails } from "./types";

interface PackBuilderStore {
  currentCategoryIndex: number;
  packId: string | null;
  items: PackItemWithDetails[];
  skippedCategories: string[];
  
  setPackId: (id: string) => void;
  setCurrentCategoryIndex: (index: number) => void;
  nextCategory: () => void;
  previousCategory: () => void;
  skipCategory: (categoryId: string) => void;
  addItem: (item: PackItemWithDetails) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearPack: () => void;
  getTotalAmount: () => number;
  getItemsByCategory: (categoryId: string) => PackItemWithDetails[];
}

export const usePackBuilderStore = create<PackBuilderStore>()(
  persist(
    (set, get) => ({
      currentCategoryIndex: 0,
      packId: null,
      items: [],
      skippedCategories: [],

      setPackId: (id) => set({ packId: id }),

      setCurrentCategoryIndex: (index) => set({ currentCategoryIndex: index }),

      nextCategory: () =>
        set((state) => ({
          currentCategoryIndex: state.currentCategoryIndex + 1,
        })),

      previousCategory: () =>
        set((state) => ({
          currentCategoryIndex: Math.max(0, state.currentCategoryIndex - 1),
        })),

      skipCategory: (categoryId) =>
        set((state) => ({
          skippedCategories: [...state.skippedCategories, categoryId],
        })),

      addItem: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === item.id);
          if (exists) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return {
            items: [...state.items, item],
          };
        }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),

      updateItemQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        })),

      clearPack: () =>
        set({
          currentCategoryIndex: 0,
          packId: null,
          items: [],
          skippedCategories: [],
        }),

      getTotalAmount: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const itemTotal = Number.parseFloat(item.totalPrice) || 0;
          return sum + itemTotal;
        }, 0);
      },

      getItemsByCategory: (categoryId) => {
        const { items } = get();
        return items.filter((item) => item.categoryId === categoryId);
      },
    }),
    { name: "bridge-pack-builder" }
  )
);
