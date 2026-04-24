import axiosInstance from "@/lib/axios";

import type { PackItemWithDetails, PackWithDetails } from "./types";

export const packBuilderService = {
  // Get user's packs
  getUserPacks: async (): Promise<PackWithDetails[]> => {
    const { data } = await axiosInstance.get("/api/packs");
    return data;
  },

  // Get single pack
  getPack: async (id: string): Promise<PackWithDetails> => {
    const { data } = await axiosInstance.get(`/api/packs/${id}`);
    return data;
  },

  // Create new pack
  createPack: async (): Promise<PackWithDetails> => {
    const { data } = await axiosInstance.post("/api/packs", {
      name: "Mon Pack Personnalisé",
      status: "draft",
    });
    return data;
  },

  // Add item to pack
  addItemToPack: async (packId: string, item: Partial<PackItemWithDetails>): Promise<PackWithDetails> => {
    const { data } = await axiosInstance.post(`/api/packs/${packId}/items`, item);
    return data;
  },

  // Remove item from pack
  removeItemFromPack: async (packId: string, itemId: string): Promise<PackWithDetails> => {
    const { data } = await axiosInstance.delete(`/api/packs/${packId}/items/${itemId}`);
    return data;
  },

  // Update item quantity
  updateItemQuantity: async (
    packId: string,
    itemId: string,
    quantity: number
  ): Promise<PackWithDetails> => {
    const { data } = await axiosInstance.patch(`/api/packs/${packId}/items/${itemId}`, {
      quantity,
    });
    return data;
  },

  // Finalize pack (convert to order)
  finalizePack: async (packId: string): Promise<{ orderId: string }> => {
    const { data } = await axiosInstance.post(`/api/packs/${packId}/finalize`);
    return data;
  },

  // Get invoice URL
  getInvoiceUrl: (packId: string): string => {
    return `/api/packs/${packId}/invoice`;
  },
};
