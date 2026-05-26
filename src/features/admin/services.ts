import axiosInstance from "@/lib/axios";

import type {
  Category,
  CategoryFilters,
  CategoryWithSubcategories,
  NewCategory,
  NewPendingAction,
  NewResource,
  NewService,
  NewServiceVariant,
  NewVendorMember,
  PendingAction,
  Resource,
  ResourceFilters,
  Service,
  ServiceFilters,
  ServiceVariant,
  ServiceWithRelations,
  User,
  UserFilters,
  VendorContext,
  VendorMember,
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

  createServiceVariant: async (
    serviceId: string,
    variant: Omit<NewServiceVariant, "id" | "serviceId">,
  ): Promise<ServiceVariant> => {
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

  // Vendor Members
  getVendorMembers: async (
    vendorId: string,
  ): Promise<
    Array<{ member: VendorMember; user: { id: string; email: string; name: string; image: string | null } }>
  > => {
    const { data } = await axiosInstance.get("/api/vendor-members", { params: { vendorId } });
    return data;
  },

  createVendorMember: async (member: import("./types").CreateVendorMemberInput): Promise<VendorMember> => {
    const { data } = await axiosInstance.post("/api/vendor-members", member);
    return data;
  },

  updateVendorMember: async (id: string, member: Partial<VendorMember>): Promise<VendorMember> => {
    const { data } = await axiosInstance.put(`/api/vendor-members/${id}`, member);
    return data;
  },

  deleteVendorMember: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/vendor-members/${id}`);
  },

  // User Vendor Context
  getUserVendorContext: async (): Promise<VendorContext> => {
    const { data } = await axiosInstance.get("/api/users/me/vendor-context");
    return data;
  },

  // Pending Actions
  getPendingActions: async (
    vendorId: string,
    status?: string,
  ): Promise<Array<{ action: PendingAction; requester: { id: string; email: string; name: string } }>> => {
    const { data } = await axiosInstance.get("/api/pending-actions", { params: { vendorId, status } });
    return data;
  },

  createPendingAction: async (action: Omit<NewPendingAction, "id">): Promise<PendingAction> => {
    const { data } = await axiosInstance.post("/api/pending-actions", action);
    return data;
  },

  reviewPendingAction: async (
    id: string,
    status: "approved" | "rejected",
    reason?: string,
  ): Promise<{ message: string; action: PendingAction }> => {
    const { data } = await axiosInstance.put(`/api/pending-actions/${id}`, { status, reason });
    return data;
  },
};
