"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/react-query/query-keys";

import { resourcesService } from "./services";
import type { ResourceFilters } from "./types";

export function useResources(filters?: ResourceFilters) {
  return useQuery({
    queryKey: queryKeys.resources.list(filters),
    queryFn: () => resourcesService.getResources(filters),
  });
}
