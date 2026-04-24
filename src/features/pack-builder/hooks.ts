"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/react-query/query-keys";

import { packBuilderService } from "./services";
import type { PackItemWithDetails } from "./types";

// Get user packs
export function useUserPacks() {
  return useQuery({
    queryKey: queryKeys.packs.list(),
    queryFn: () => packBuilderService.getUserPacks(),
  });
}

// Get single pack
export function usePack(id: string) {
  return useQuery({
    queryKey: queryKeys.packs.detail(id),
    queryFn: () => packBuilderService.getPack(id),
    enabled: !!id,
  });
}

// Create pack
export function useCreatePack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => packBuilderService.createPack(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packs.list() });
    },
  });
}

// Add item to pack
export function useAddItemToPack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ packId, item }: { packId: string; item: Partial<PackItemWithDetails> }) =>
      packBuilderService.addItemToPack(packId, item),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packs.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.packs.list() });
    },
  });
}

// Remove item from pack
export function useRemoveItemFromPack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ packId, itemId }: { packId: string; itemId: string }) =>
      packBuilderService.removeItemFromPack(packId, itemId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packs.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.packs.list() });
    },
  });
}

// Update item quantity
export function useUpdateItemQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ packId, itemId, quantity }: { packId: string; itemId: string; quantity: number }) =>
      packBuilderService.updateItemQuantity(packId, itemId, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packs.detail(data.id) });
    },
  });
}

// Finalize pack
export function useFinalizePack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (packId: string) => packBuilderService.finalizePack(packId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packs.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
    },
  });
}
