"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  serviceId: string;
  variantId?: string;
  quantity: number;
  metadata?: Record<string, any>;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (serviceId: string, variantId?: string) => void;
  updateQuantity: (serviceId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const exists = state.items.find(
            (i) => i.serviceId === item.serviceId && i.variantId === item.variantId
          );

          if (exists) {
            return {
              items: state.items.map((i) =>
                i.serviceId === item.serviceId && i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),
      removeItem: (serviceId, variantId) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.serviceId === serviceId && i.variantId === variantId)),
        })),
      updateQuantity: (serviceId, quantity, variantId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.serviceId === serviceId && i.variantId === variantId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "bridge-cart" }
  )
);
