"use client";

import { useEffect, type ReactNode } from "react";

import { useAuthStore } from "@/features/auth/store";
import { connectSocket, disconnectSocket } from "@/lib/socket/client";

import { useNotifications } from "../hooks";
import { useNotificationsStore } from "../store";
import type { Notification } from "../types";

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const addNotification = useNotificationsStore((s) => s.addNotification);
  const markAsRead = useNotificationsStore((s) => s.markAllAsRead);
  const removeNotification = useNotificationsStore((s) => s.removeNotification);
  const setConnected = useNotificationsStore((s) => s.setConnected);

  useNotifications({ limit: 20 });

  useEffect(() => {
    if (!currentUser?.id) return;

    const socket = connectSocket({ userId: currentUser.id, role: currentUser.role });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("notification:new", (notification: Notification) => {
      addNotification(notification);
    });

    socket.on("notification:all-read", () => {
      markAsRead();
    });

    socket.on("notification:deleted", ({ id }: { id: string }) => {
      removeNotification(id);
    });

    return () => {
      socket.off("notification:new");
      socket.off("notification:all-read");
      socket.off("notification:deleted");
      socket.off("connect");
      socket.off("disconnect");
      disconnectSocket();
    };
  }, [currentUser?.id, currentUser?.role, addNotification, markAsRead, removeNotification, setConnected]);

  return <>{children}</>;
}
