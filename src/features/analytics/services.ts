import axiosInstance from "@/lib/axios";

import type { AnalyticsData, TrackVisitorRequest } from "./types";

export const analyticsService = {
  async getActivityData(period = "30"): Promise<AnalyticsData[]> {
    const { data } = await axiosInstance.get(`/api/analytics?period=${period}`);
    return data;
  },

  async trackVisitor(data: TrackVisitorRequest): Promise<void> {
    await axiosInstance.post("/api/analytics", data);
  },
};
