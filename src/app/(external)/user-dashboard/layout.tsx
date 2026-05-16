"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserDataSync } from "@/components/user-dashboard/user-data-sync";
import { UserHeader } from "@/components/user-dashboard/user-header";
import { UserSidebar } from "@/components/user-dashboard/user-sidebar";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserDataSync>
      <SidebarProvider>
        <UserSidebar />
        <SidebarInset>
          <UserHeader />
          <main className="flex-1 p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </UserDataSync>
  );
}
