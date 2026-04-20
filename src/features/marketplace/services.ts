import axiosInstance from "@/lib/axios";

import type { CategoryWithSubs, ServiceFilters, ServiceWithDetails } from "./types";

export const marketplaceService = {
  // Categories
  getCategories: async (): Promise<CategoryWithSubs[]> => {
    const { data } = await axiosInstance.get("/api/categories");
    return data;
  },

  // Services
  getServices: async (filters?: ServiceFilters): Promise<ServiceWithDetails[]> => {
    const { data } = await axiosInstance.get("/api/services", { params: filters });
    return data;
  },

  getService: async (id: string): Promise<ServiceWithDetails> => {
    const { data } = await axiosInstance.get(`/api/services/${id}`);
    return data;
  },

  getServiceVariants: async (serviceId: string) => {
    const { data } = await axiosInstance.get(`/api/services/${serviceId}/variants`);
    return data;
  },
};
