import axios from "axios";

import type { NotificationFilters, NotificationPayload, NotificationsResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const notificationsService = {
  getNotifications: async (filters: NotificationFilters = {}): Promise<NotificationsResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));
    if (filters.unreadOnly) params.set("unreadOnly", "true");
    if (filters.type) params.set("type", filters.type);

    const response = await axios.get<NotificationsResponse>(`${BASE_URL}/api/notifications?${params.toString()}`, {
      withCredentials: true,
    });
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await axios.patch(
      `${BASE_URL}/api/notifications/${notificationId}`,
      { readAt: new Date() },
      { withCredentials: true },
    );
  },

  markAllAsRead: async (): Promise<void> => {
    await axios.patch(`${BASE_URL}/api/notifications`, { markAllRead: true }, { withCredentials: true });
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/api/notifications/${notificationId}`, { withCredentials: true });
  },

  createNotification: async (payload: NotificationPayload): Promise<void> => {
    await axios.post(`${BASE_URL}/api/notifications`, payload, { withCredentials: true });
  },
};
