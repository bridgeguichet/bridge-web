"use client";

import { NotificationDropdown } from "@/features/notifications/components/notification-dropdown";
import { NotificationProvider } from "@/features/notifications/components/notification-provider";

export function HeaderNotifications() {
  return (
    <NotificationProvider>
      <NotificationDropdown notificationsHref="/dashboard/notifications" />
    </NotificationProvider>
  );
}
