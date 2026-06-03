"use client";

import { Bell } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import type { Notification } from "../types";
import { NotificationItem } from "./notification-item";

interface NotificationListProps {
  notifications: Notification[];
  isLoading?: boolean;
  onClose?: () => void;
  maxHeight?: string;
}

export function NotificationList({
  notifications,
  isLoading,
  onClose,
  maxHeight = "360px",
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-1 p-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 px-3 py-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-2 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="rounded-full bg-muted p-3">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="mt-3 font-medium text-sm">Aucune notification</p>
        <p className="mt-1 text-muted-foreground text-xs">Vous êtes à jour !</p>
      </div>
    );
  }

  return (
    <ScrollArea style={{ maxHeight }} className="overflow-y-auto">
      <div className="space-y-0.5 p-2">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} onClose={onClose} />
        ))}
      </div>
    </ScrollArea>
  );
}
