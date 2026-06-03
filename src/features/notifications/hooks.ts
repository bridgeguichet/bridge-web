import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { NotificationFilters } from "./types";
import { notificationsService } from "./services";
import { useNotificationsStore } from "./store";

export const NOTIFICATIONS_QUERY_KEY = "notifications";

export function useNotifications(filters: NotificationFilters = {}) {
  const setNotifications = useNotificationsStore((s) => s.setNotifications);

  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, filters],
    queryFn: async () => {
      const data = await notificationsService.getNotifications(filters);
      if (!filters.page || filters.page === 1) {
        setNotifications(data.notifications, data.unreadCount);
      }
      return data;
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useUnreadNotifications() {
  return useNotifications({ unreadOnly: true, limit: 20 });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const markAsRead = useNotificationsStore((s) => s.markAsRead);

  return useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: (_, notificationId) => {
      markAsRead(notificationId);
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  const markAllAsRead = useNotificationsStore((s) => s.markAllAsRead);

  return useMutation({
    mutationFn: notificationsService.markAllAsRead,
    onSuccess: () => {
      markAllAsRead();
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const removeNotification = useNotificationsStore((s) => s.removeNotification);

  return useMutation({
    mutationFn: notificationsService.deleteNotification,
    onSuccess: (_, notificationId) => {
      removeNotification(notificationId);
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
}
