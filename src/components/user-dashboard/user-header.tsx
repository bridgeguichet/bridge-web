"use client";

import Link from "next/link";

import { Logout01Icon, Notification01Icon, Search01Icon, UserCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/features/auth";
import { useLogout } from "@/features/auth/hooks";
import { getInitials } from "@/lib/utils";

export function UserHeader() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { mutate: logout } = useLogout("/auth/login");

  const handleLogout = () => {
    logout();
  };

  const isGuest = !currentUser;
  const userAvatar = isGuest
    ? undefined
    : currentUser?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name)}`;

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />

      <div className="flex flex-1 items-center justify-end gap-2">
        <Button variant="ghost" size="icon" className="relative size-8" asChild>
          <Link href="/user-dashboard/notifications">
            <HugeiconsIcon icon={Notification01Icon} size={18} color="currentColor" />
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="sr-only">Notifications</span>
          </Link>
        </Button>

        {isGuest ? (
          <Button variant="ghost" size="icon" className="size-8" asChild>
            <Link href="/auth/login">
              <HugeiconsIcon icon={UserCircleIcon} size={20} color="currentColor" />
            </Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative size-8 rounded-full p-0">
                <Avatar className="size-8">
                  <AvatarImage src={userAvatar} alt={currentUser?.name || "User"} />
                  <AvatarFallback>{getInitials(currentUser?.name || "U")}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium text-sm leading-none">{currentUser?.name}</p>
                  <p className="text-muted-foreground text-xs leading-none">{currentUser?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/user-dashboard/profile">
                  <HugeiconsIcon icon={UserCircleIcon} size={16} color="currentColor" className="mr-2" />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <HugeiconsIcon icon={Logout01Icon} size={16} color="currentColor" className="mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
