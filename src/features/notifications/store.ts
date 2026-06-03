import { create } from "zustand";

import type { Notification } from "./types";

interface NotificationsStore {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  addNotification: (notification: Notification) => void;
  setNotifications: (notifications: Notification[], unreadCount: number) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  setConnected: (connected: boolean) => void;
  incrementUnread: () => void;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  setNotifications: (notifications, unreadCount) =>
    set({ notifications, unreadCount }),

  markAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, readAt: new Date() } : n,
      ),
      unreadCount: Math.max(
        0,
        state.unreadCount -
          (state.notifications.find((n) => n.id === notificationId && !n.readAt) ? 1 : 0),
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, readAt: n.readAt ?? new Date() })),
      unreadCount: 0,
    })),

  removeNotification: (notificationId) =>
    set((state) => {
      const notif = state.notifications.find((n) => n.id === notificationId);
      return {
        notifications: state.notifications.filter((n) => n.id !== notificationId),
        unreadCount: notif && !notif.readAt ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    }),

  setConnected: (connected) => set({ isConnected: connected }),

  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
}));
