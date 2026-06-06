import axiosInstance from "@/lib/axios";

import type { CreateOrderRequest, Order, OrderFilters, OrderStats } from "./types";

export const ordersService = {
  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    const params = new URLSearchParams();

    if (filters?.type) params.append("type", filters.type);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.userOnly) params.append("userOnly", "true");

    const queryString = params.toString();
    const url = `/api/orders${queryString ? `?${queryString}` : ""}`;

    const { data } = await axiosInstance.get(url);
    return data;
  },

  async getOrder(id: string): Promise<Order> {
    const { data } = await axiosInstance.get(`/api/orders/${id}`);
    return data;
  },

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const { data: responseData } = await axiosInstance.post("/api/orders", data);
    return responseData;
  },

  async updateOrderStatus(id: string, status: "completed" | "failed" | "refunded"): Promise<Order> {
    const { data } = await axiosInstance.patch(`/api/orders/${id}`, { status });
    return data;
  },

  async deleteOrder(id: string): Promise<void> {
    await axiosInstance.delete(`/api/orders/${id}`);
  },

  async getOrderStats(type?: string): Promise<OrderStats> {
    const params = type ? `?type=${type}` : "";
    const { data } = await axiosInstance.get(`/api/orders/stats${params}`);
    return data;
  },
};
