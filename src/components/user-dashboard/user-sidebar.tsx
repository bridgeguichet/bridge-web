"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  CreditCardIcon,
  DashboardSquare01Icon,
  FavouriteIcon,
  Invoice01Icon,
  Logout01Icon,
  Notification01Icon,
  Package01Icon,
  Settings01Icon,
  ShoppingCart01Icon,
  UserCircleIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronsUpDown } from "lucide-react";

import { Logo, LogoIcon } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/features/auth";
import { useLogout } from "@/features/auth/hooks";
import { useCartStore } from "@/features/cart/store";
import { getInitials } from "@/lib/utils";

const sidebarItems = [
  { icon: DashboardSquare01Icon, label: "Vue d'ensemble", href: "/user-dashboard" },
  { icon: Package01Icon, label: "Mes packs", href: "/user-dashboard/packs" },
  { icon: Invoice01Icon, label: "Mes commandes", href: "/user-dashboard/commandes" },
  { icon: ShoppingCart01Icon, label: "Panier", href: "/user-dashboard/cart" },
  { icon: FavouriteIcon, label: "Favoris", href: "/user-dashboard/favorites" },
  { icon: CreditCardIcon, label: "Transactions", href: "/user-dashboard/transactions" },
  { icon: UserIcon, label: "Profil", href: "/user-dashboard/profile" },
  { icon: Notification01Icon, label: "Notifications", href: "/user-dashboard/notifications" },
  { icon: Settings01Icon, label: "Paramètres", href: "/user-dashboard/parametre" },
];

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const currentUser = useAuthStore((state) => state.currentUser);
  const { mutate: logout } = useLogout("/auth/login");

  const handleLogout = () => {
    logout();
  };

  const userAvatar = currentUser?.image
    ? currentUser.image
    : currentUser?.name
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}`
      : undefined;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className={state === "collapsed" ? "justify-center" : undefined}>
                {state === "collapsed" ? (
                  <LogoIcon className="size-5" />
                ) : (
                  <Logo className="h-10 w-auto" />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                const showBadge = item.href === "/user-dashboard/cart" && cartCount > 0;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href}>
                        <HugeiconsIcon icon={Icon} size={20} color="currentColor" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {showBadge && (
                      <SidebarMenuBadge className="bg-accent text-accent-foreground">{cartCount}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={userAvatar} alt={currentUser?.name || "User"} />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(currentUser?.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{currentUser?.name || "Utilisateur"}</span>
                    <span className="truncate text-xs text-muted-foreground">{currentUser?.email || ""}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage src={userAvatar} alt={currentUser?.name || "User"} />
                      <AvatarFallback className="rounded-lg">
                        {getInitials(currentUser?.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{currentUser?.name || "Utilisateur"}</span>
                      <span className="truncate text-xs text-muted-foreground">{currentUser?.email || ""}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/user-dashboard/profile">
                      <HugeiconsIcon icon={UserCircleIcon} size={16} color="currentColor" className="mr-2" />
                      Compte
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user-dashboard/transactions">
                      <HugeiconsIcon icon={CreditCardIcon} size={16} color="currentColor" className="mr-2" />
                      Transaction
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user-dashboard/notifications">
                      <HugeiconsIcon icon={Notification01Icon} size={16} color="currentColor" className="mr-2" />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <HugeiconsIcon icon={Logout01Icon} size={16} color="currentColor" className="mr-2" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
