"use client";

import Link from "next/link";

import { CircleHelp, ClipboardList, Database, File, Search, Settings } from "lucide-react";

import { Logo, LogoIcon } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/features/auth";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const _data = {
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: CircleHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: Database,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardList,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: File,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { state } = useSidebar();

  const userWithAvatar = currentUser
    ? {
        ...currentUser,
        avatar: currentUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}`,
      }
    : null;

  return (
    <Sidebar {...props} variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link prefetch={false} href="/dashboard/default" className={state === "collapsed" ? "justify-center" : ""}>
                {state === "collapsed" ? <LogoIcon className="size-6 w-auto" /> : <Logo className="h-14 w-auto" />}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>{userWithAvatar && <NavUser user={userWithAvatar} />}</SidebarFooter>
    </Sidebar>
  );
}
