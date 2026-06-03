"use client";

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  unreadCount?: number;
  className?: string;
}

export function NotificationBell({ unreadCount = 0, className }: NotificationBellProps) {
  return (
    <Button variant="ghost" size="icon" className={cn("relative h-8 w-8", className)}>
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="-right-0.5 -top-0.5 absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 font-bold text-destructive-foreground text-[10px] leading-none">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
      <span className="sr-only">
        {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}` : "Notifications"}
      </span>
    </Button>
  );
}
