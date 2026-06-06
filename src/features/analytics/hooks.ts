"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/react-query/query-keys";

import { analyticsService } from "./services";
import type { AnalyticsPeriod, TrackVisitorRequest } from "./types";

export function useActivityData(period: AnalyticsPeriod = "30") {
  return useQuery({
    queryKey: queryKeys.analytics.activity(period),
    queryFn: () => analyticsService.getActivityData(period),
  });
}

export function useTrackVisitor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TrackVisitorRequest) => analyticsService.trackVisitor(data),
    onSuccess: () => {
      // Invalidate all analytics queries
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}
