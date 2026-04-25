"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { extractErrorMessage } from "@/lib/error-handler";
import { queryKeys } from "@/lib/react-query/query-keys";

import { ordersService } from "./services";
import type { CreateOrderRequest, OrderFilters } from "./types";

export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: () => ordersService.getOrders(filters),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersService.getOrder(id),
    enabled: !!id,
    // Polling pour commandes en cours
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === "in_progress" ? 30000 : false; // 30s
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) =>
      ordersService.createOrder(orderData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success("Commande créée avec succès");
      router.push("/user-dashboard/orders");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersService.updateOrderStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(data.id),
      });
      toast.success("Statut mis à jour");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersService.cancelOrder(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(data.id),
      });
      toast.success("Commande annulée");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}
