"use client";

import { BadgeCheck, Bell, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore, useLogout } from "@/features/auth";
import { useTranslation } from "@/lib/i18n/use-translation";
import { getInitials } from "@/lib/utils";

export function AccountSwitcher() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useLogout();

  if (!currentUser) {
    return null;
  }

  const userWithAvatar = {
    ...currentUser,
    avatar: currentUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}`,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9 cursor-pointer rounded-lg">
          <AvatarImage src={userWithAvatar.avatar} alt={userWithAvatar.name} />
          <AvatarFallback className="rounded-lg">{getInitials(userWithAvatar.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
        <div className="flex items-center gap-2 px-1 py-1.5">
          <Avatar className="size-9 rounded-lg">
            <AvatarImage src={userWithAvatar.avatar} alt={userWithAvatar.name} />
            <AvatarFallback className="rounded-lg">{getInitials(userWithAvatar.name)}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{userWithAvatar.name}</span>
            <span className="truncate text-muted-foreground text-xs">{userWithAvatar.email}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            {t("userMenu.account")}
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <CreditCard />
            {t("userMenu.billing")}
          </DropdownMenuItem> */}
          <DropdownMenuItem>
            <Bell />
            {t("userMenu.notifications")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout.mutate()} disabled={logout.isPending}>
          <LogOut />
          {logout.isPending ? "Déconnexion..." : t("userMenu.logOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
