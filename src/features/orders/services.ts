import axiosInstance from "@/lib/axios";

import type { CreateOrderRequest, OrderFilters, OrderWithItems } from "./types";

export const ordersService = {
  getOrders: async (filters?: OrderFilters): Promise<OrderWithItems[]> => {
    const { data } = await axiosInstance.get("/api/orders", { params: filters });
    return data;
  },

  getOrder: async (id: string): Promise<OrderWithItems> => {
    const { data } = await axiosInstance.get(`/api/orders/${id}`);
    return data;
  },

  createOrder: async (orderData: CreateOrderRequest): Promise<OrderWithItems> => {
    const { data } = await axiosInstance.post("/api/orders", orderData);
    return data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<OrderWithItems> => {
    const { data } = await axiosInstance.patch(`/api/orders/${id}`, { status });
    return data;
  },

  cancelOrder: async (id: string): Promise<OrderWithItems> => {
    const { data } = await axiosInstance.patch(`/api/orders/${id}`, { status: "cancelled" });
    return data;
  },
};
