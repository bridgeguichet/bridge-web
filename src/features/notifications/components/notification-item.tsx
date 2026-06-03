"use client";

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useDeleteNotification, useMarkAsRead } from "../hooks";
import type { Notification } from "../types";

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

const TYPE_ICONS: Record<string, string> = {
  ORDER_CREATED: "🛒",
  ORDER_UPDATED: "📦",
  PAYMENT_CONFIRMED: "✅",
  PAYMENT_FAILED: "❌",
  REFUND_PROCESSED: "💰",
  PACK_CREATED: "📋",
  PACK_STATUS_UPDATED: "🔄",
  SERVICE_COMPLETED: "✨",
  SERVICE_DEADLINE_APPROACHING: "⏰",
  APPOINTMENT_SCHEDULED: "📅",
  APPOINTMENT_REMINDER: "🔔",
  APPOINTMENT_CANCELLED: "🚫",
  MESSAGE_RECEIVED: "💬",
  ADMIN_ALERT: "⚠️",
  SYSTEM: "🔔",
};

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const markAsRead = useMarkAsRead();
  const deleteNotif = useDeleteNotification();

  const isUnread = !notification.readAt;
  const icon = TYPE_ICONS[notification.type] ?? "🔔";
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  const handleMarkRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnread) {
      markAsRead.mutate(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotif.mutate(notification.id);
    onClose?.();
  };

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted/50",
        isUnread && "bg-primary/5",
      )}
      onClick={handleMarkRead}
      role={isUnread ? "button" : undefined}
      tabIndex={isUnread ? 0 : undefined}
      onKeyDown={isUnread ? (e) => e.key === "Enter" && handleMarkRead(e as unknown as React.MouseEvent) : undefined}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-base">
        {icon}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm leading-tight", isUnread ? "font-semibold" : "font-medium")}>
            {notification.title}
          </p>
          {isUnread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 line-clamp-2 text-muted-foreground text-xs">{notification.message}</p>
        <p className="mt-1 text-muted-foreground text-xs">{timeAgo}</p>
      </div>

      <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex">
        {isUnread && (
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={handleMarkRead}
            title="Marquer comme lu"
          >
            <Check className="h-3 w-3" />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-destructive hover:text-destructive"
          onClick={handleDelete}
          title="Supprimer"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
