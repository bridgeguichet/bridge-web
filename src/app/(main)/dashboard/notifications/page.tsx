"use client";

import { useState } from "react";

import { CheckCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarkAllAsRead, useNotifications } from "@/features/notifications/hooks";
import { NotificationList } from "@/features/notifications/components/notification-list";
import { NotificationProvider } from "@/features/notifications/components/notification-provider";
import { useNotificationsStore } from "@/features/notifications/store";

function NotificationsContent() {
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useNotifications({
    page,
    limit: 20,
    unreadOnly: tab === "unread",
  });

  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const storeNotifications = useNotificationsStore((s) => s.notifications);
  const markAllAsRead = useMarkAllAsRead();

  const displayUnread = unreadCount > 0 ? unreadCount : (data?.unreadCount ?? 0);
  const notifications =
    page === 1 && tab === "all" && storeNotifications.length > 0
      ? storeNotifications
      : (data?.notifications ?? []);

  const handleTabChange = (value: string) => {
    setTab(value as "all" | "unread");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Retrouvez ici toutes vos notifications</p>
        </div>
        {displayUnread > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            <CheckCheck className="h-4 w-4" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Centre de notifications</CardTitle>
              <CardDescription>Les alertes et mises à jour de votre espace</CardDescription>
            </div>
            {displayUnread > 0 && (
              <Badge variant="destructive">{displayUnread} non lue{displayUnread > 1 ? "s" : ""}</Badge>
            )}
          </div>
          <Tabs value={tab} onValueChange={handleTabChange} className="mt-2">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="unread" className="gap-2">
                Non lues
                {displayUnread > 0 && (
                  <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                    {displayUnread}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <NotificationList
            notifications={notifications}
            isLoading={isLoading}
            maxHeight="600px"
          />
          {data?.hasMore && (
            <div className="border-t p-4 text-center">
              <Button variant="ghost" size="sm" onClick={() => setPage((p) => p + 1)}>
                Charger plus
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <NotificationProvider>
      <NotificationsContent />
    </NotificationProvider>
  );
}
