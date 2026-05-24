import axiosInstance from "@/lib/axios";

import type {
  Category,
  CategoryFilters,
  CategoryWithSubcategories,
  NewCategory,
  NewResource,
  NewService,
  NewServiceVariant,
  Resource,
  ResourceFilters,
  Service,
  ServiceFilters,
  ServiceVariant,
  ServiceWithRelations,
  User,
  UserFilters,
} from "./types";

export const adminService = {
  // Categories
  getCategories: async (_filters?: CategoryFilters): Promise<CategoryWithSubcategories[]> => {
    const { data } = await axiosInstance.get("/api/categories");
    return data;
  },

  createCategory: async (category: Omit<NewCategory, "id">): Promise<Category> => {
    const { data } = await axiosInstance.post("/api/categories", category);
    return data;
  },

  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    const { data } = await axiosInstance.put(`/api/categories/${id}`, category);
    return data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/categories/${id}`);
  },

  // Resources
  getResources: async (filters?: ResourceFilters): Promise<Resource[]> => {
    const { data } = await axiosInstance.get("/api/resources", { params: filters });
    return data;
  },

  createResource: async (resource: Omit<NewResource, "id">): Promise<Resource> => {
    const { data } = await axiosInstance.post("/api/resources", resource);
    return data;
  },

  updateResource: async (id: string, resource: Partial<Resource>): Promise<Resource> => {
    const { data } = await axiosInstance.put("/api/resources", { id, ...resource });
    return data;
  },

  deleteResource: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/resources?id=${id}`);
  },

  // Services
  getServices: async (filters?: ServiceFilters): Promise<ServiceWithRelations[]> => {
    const params: Record<string, string> = {};
    if (filters?.categoryId) params.categoryId = filters.categoryId;
    if (filters?.status) params.status = filters.status;
    if (filters?.search) params.search = filters.search;

    const { data } = await axiosInstance.get("/api/services", { params });
    return data;
  },

  getService: async (id: string): Promise<ServiceWithRelations> => {
    const { data } = await axiosInstance.get(`/api/services/${id}`);
    return data;
  },

  createService: async (service: Omit<NewService, "id">): Promise<Service> => {
    const { data } = await axiosInstance.post("/api/services", service);
    return data;
  },

  updateService: async (id: string, service: Partial<Service>): Promise<Service> => {
    const { data } = await axiosInstance.put(`/api/services/${id}`, service);
    return data;
  },

  deleteService: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/services/${id}`);
  },

  // Service Variants
  getServiceVariants: async (serviceId: string): Promise<ServiceVariant[]> => {
    const { data } = await axiosInstance.get(`/api/services/${serviceId}/variants`);
    return data;
  },

  createServiceVariant: async (serviceId: string, variant: Omit<NewServiceVariant, "id" | "serviceId">): Promise<ServiceVariant> => {
    const { data } = await axiosInstance.post(`/api/services/${serviceId}/variants`, variant);
    return data;
  },

  updateServiceVariant: async (id: string, variant: Partial<ServiceVariant>): Promise<ServiceVariant> => {
    const { data } = await axiosInstance.put(`/api/service-variants/${id}`, variant);
    return data;
  },

  deleteServiceVariant: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/service-variants/${id}`);
  },

  // Users
  getUsers: async (filters?: UserFilters): Promise<User[]> => {
    const { data } = await axiosInstance.get("/api/users", { params: filters });
    return data;
  },

  getStaffUsers: async (): Promise<User[]> => {
    const { data } = await axiosInstance.get("/api/users", { params: { role: "admin,manager,staff" } });
    return data.filter((u: User) => u.role !== "customer");
  },

  getCustomerUsers: async (): Promise<User[]> => {
    const { data } = await axiosInstance.get("/api/users", { params: { role: "customer" } });
    return data;
  },

  updateUser: async (id: string, user: Partial<User>): Promise<User> => {
    const { data } = await axiosInstance.put(`/api/users/${id}`, user);
    return data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/users/${id}`);
  },
};
