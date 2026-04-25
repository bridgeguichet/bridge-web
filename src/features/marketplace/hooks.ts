"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/react-query/query-keys";

import { marketplaceService } from "./services";
import type { ServiceFilters } from "./types";

// Categories
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => marketplaceService.getCategories(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Services
export function useServices(filters?: ServiceFilters) {
  return useQuery({
    queryKey: queryKeys.services.list(filters),
    queryFn: () => marketplaceService.getServices(filters),
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: () => marketplaceService.getService(id),
    enabled: !!id,
  });
}

export function useServiceVariants(serviceId: string) {
  return useQuery({
    queryKey: queryKeys.services.variants(serviceId),
    queryFn: () => marketplaceService.getServiceVariants(serviceId),
    enabled: !!serviceId,
  });
}

// Infinite scroll services
export function useInfiniteServices(filters?: ServiceFilters) {
  return useInfiniteQuery({
    queryKey: queryKeys.services.list(filters),
    queryFn: ({ pageParam = 0 }) => marketplaceService.getServices({ ...filters, offset: pageParam as number }),
    getNextPageParam: (lastPage, pages) => (lastPage.length === 20 ? pages.length * 20 : undefined),
    initialPageParam: 0,
  });
}
