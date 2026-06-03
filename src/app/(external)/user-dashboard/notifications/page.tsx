"use client";

import { useState } from "react";

import { Notification01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationList } from "@/features/notifications/components/notification-list";
import { useMarkAllAsRead, useNotifications } from "@/features/notifications/hooks";
import { useNotificationsStore } from "@/features/notifications/store";

export default function NotificationsPage() {
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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <HugeiconsIcon icon={Notification01Icon} size={24} color="currentColor" className="text-primary" />
            </div>
            <div>
              <h1 className="font-black text-3xl text-gray-900">Mes notifications</h1>
              <p className="text-muted-foreground">Restez informé de l&apos;activité de votre compte</p>
            </div>
          </div>
          {displayUnread > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              <CheckCheck className="h-4 w-4" />
              Tout lire
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Tabs value={tab} onValueChange={handleTabChange}>
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
              {displayUnread > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {displayUnread} non lue{displayUnread > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <NotificationList
              notifications={notifications}
              isLoading={isLoading}
              maxHeight="580px"
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
      </motion.div>
    </div>
  );
}
