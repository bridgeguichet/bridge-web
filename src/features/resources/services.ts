import axiosInstance from "@/lib/axios";

import type { Resource, ResourceFilters } from "./types";

export const resourcesService = {
  getResources: async (filters?: ResourceFilters): Promise<Resource[]> => {
    const { data } = await axiosInstance.get("/api/resources", { params: filters });
    return data;
  },

  createResource: async (resourceData: Partial<Resource>): Promise<Resource> => {
    const { data } = await axiosInstance.post("/api/resources", resourceData);
    return data;
  },
};
