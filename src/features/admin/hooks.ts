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
  NewVendorMember,
  PendingAction,
  Resource,
  ResourceFilters,
  Service,
  ServiceFilters,
  ServiceVariant,
  User,
  UserFilters,
  VendorMember,
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

// Vendor Members
export function useVendorMembers(vendorId: string) {
  return useQuery({
    queryKey: ["vendor-members", vendorId],
    queryFn: () => adminService.getVendorMembers(vendorId),
    enabled: !!vendorId,
  });
}

export function useCreateVendorMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (member: import("./types").CreateVendorMemberInput) => adminService.createVendorMember(member),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-members", variables.vendorId] });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.customers() });
    },
  });
}

export function useUpdateVendorMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, vendorId, data }: { id: string; vendorId: string; data: Partial<VendorMember> }) =>
      adminService.updateVendorMember(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-members", variables.vendorId] });
    },
  });
}

export function useDeleteVendorMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, vendorId }: { id: string; vendorId: string }) => adminService.deleteVendorMember(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-members", variables.vendorId] });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.customers() });
    },
  });
}

// User Vendor Context
export function useUserVendorContext() {
  return useQuery({
    queryKey: ["user-vendor-context"],
    queryFn: () => adminService.getUserVendorContext(),
    retry: false,
  });
}

// Pending Actions
export function usePendingActions(vendorId: string, status?: string) {
  return useQuery({
    queryKey: ["pending-actions", vendorId, status],
    queryFn: () => adminService.getPendingActions(vendorId, status),
    enabled: !!vendorId,
    staleTime: 0, // Les données sont toujours considérées comme périmées
    refetchOnWindowFocus: true, // Rafraîchir quand la fenêtre reprend le focus
    refetchOnMount: true, // Rafraîchir à chaque montage
  });
}

// Pending Actions Statistics (pour les compteurs)
export function usePendingActionsStats(vendorId: string) {
  return useQuery({
    queryKey: ["pending-actions-stats", vendorId],
    queryFn: () => adminService.getPendingActionsStats(vendorId),
    enabled: !!vendorId,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

export function useCreatePendingAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: Omit<PendingAction, "id" | "createdAt" | "reviewedAt">) =>
      adminService.createPendingAction(action),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pending-actions", variables.vendorId] });
    },
  });
}

export function useReviewPendingAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      vendorId,
      status,
      reason,
    }: {
      id: string;
      vendorId: string;
      status: "approved" | "rejected";
      reason?: string;
    }) => adminService.reviewPendingAction(id, status, reason),
    onSuccess: (_data, variables) => {
      // Invalider TOUTES les queries pending-actions y compris les stats
      queryClient.invalidateQueries({ 
        queryKey: ["pending-actions"],
        exact: false 
      });
      
      // Forcer un rafraîchissement immédiat de toutes les queries
      queryClient.refetchQueries({ 
        queryKey: ["pending-actions"],
        exact: false 
      });
    },
  });
}
