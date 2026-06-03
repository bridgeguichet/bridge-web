"use client";

import Link from "next/link";

import { CheckCheck, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { useMarkAllAsRead, useNotifications } from "../hooks";
import { useNotificationsStore } from "../store";
import { NotificationBell } from "./notification-bell";
import { NotificationList } from "./notification-list";

interface NotificationDropdownProps {
  notificationsHref: string;
}

export function NotificationDropdown({ notificationsHref }: NotificationDropdownProps) {
  const { data, isLoading } = useNotifications({ limit: 10 });
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const storeNotifications = useNotificationsStore((s) => s.notifications);
  const markAllAsRead = useMarkAllAsRead();

  const displayNotifications = storeNotifications.length > 0 ? storeNotifications.slice(0, 10) : (data?.notifications ?? []);
  const displayUnread = unreadCount > 0 ? unreadCount : (data?.unreadCount ?? 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <NotificationBell unreadCount={displayUnread} />
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h4 className="font-semibold text-sm">Notifications</h4>
            {displayUnread > 0 && (
              <p className="text-muted-foreground text-xs">{displayUnread} non lue{displayUnread > 1 ? "s" : ""}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            {displayUnread > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1.5 text-xs"
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Tout lire
              </Button>
            )}
            <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
              <Link href={notificationsHref}>
                <Settings className="h-3.5 w-3.5" />
                <span className="sr-only">Paramètres notifications</span>
              </Link>
            </Button>
          </div>
        </div>
        <Separator />
        <NotificationList
          notifications={displayNotifications}
          isLoading={isLoading && displayNotifications.length === 0}
          maxHeight="340px"
        />
        {displayNotifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                <Link href={notificationsHref}>Voir toutes les notifications</Link>
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
