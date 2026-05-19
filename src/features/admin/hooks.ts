"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/react-query/query-keys";

import { adminService } from "./services";
import type {
  Category,
  CategoryFilters,
  NewCategory,
  NewResource,
  NewService,
  NewServiceVariant,
  Resource,
  ResourceFilters,
  Service,
  ServiceFilters,
  ServiceVariant,
  User,
  UserFilters,
} from "./types";

// Categories
export function useCategories(filters?: CategoryFilters) {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => adminService.getCategories(filters),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: Omit<NewCategory, "id">) => adminService.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => adminService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

// Resources
export function useResources(filters?: ResourceFilters) {
  return useQuery({
    queryKey: queryKeys.resources.list(filters as Record<string, unknown>),
    queryFn: () => adminService.getResources(filters),
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resource: Omit<NewResource, "id">) => adminService.createResource(resource),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.all });
    },
  });
}

export function useUpdateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Resource> }) => adminService.updateResource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.all });
    },
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.all });
    },
  });
}

// Services
export function useServices(filters?: ServiceFilters) {
  return useQuery({
    queryKey: queryKeys.services.list(filters as Record<string, unknown>),
    queryFn: () => adminService.getServices(filters),
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: () => adminService.getService(id),
    enabled: !!id,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (service: Omit<NewService, "id">) => adminService.createService(service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) => adminService.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}

// Service Variants
export function useServiceVariants(serviceId: string) {
  return useQuery({
    queryKey: queryKeys.serviceVariants.list(serviceId),
    queryFn: () => adminService.getServiceVariants(serviceId),
    enabled: !!serviceId,
  });
}

export function useCreateServiceVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, data }: { serviceId: string; data: Omit<NewServiceVariant, "id" | "serviceId"> }) =>
      adminService.createServiceVariant(serviceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceVariants.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}

export function useUpdateServiceVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceVariant> }) =>
      adminService.updateServiceVariant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceVariants.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}

export function useDeleteServiceVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteServiceVariant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceVariants.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}

// Users
export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: queryKeys.users.list(filters as Record<string, unknown>),
    queryFn: () => adminService.getUsers(filters),
  });
}

export function useStaffUsers() {
  return useQuery({
    queryKey: queryKeys.users.staff(),
    queryFn: () => adminService.getStaffUsers(),
  });
}

export function useCustomerUsers() {
  return useQuery({
    queryKey: queryKeys.users.customers(),
    queryFn: () => adminService.getCustomerUsers(),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => adminService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
