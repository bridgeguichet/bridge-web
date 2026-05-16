"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  CreditCardIcon,
  DashboardSquare01Icon,
  Delete01Icon,
  FavouriteIcon,
  Invoice01Icon,
  Notification01Icon,
  Package01Icon,
  ShoppingCart01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Logo, LogoIcon } from "@/components/logo";
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
import { useCartStore } from "@/features/cart/store";

const sidebarItems = [
  { icon: DashboardSquare01Icon, label: "Vue d'ensemble", href: "/user-dashboard" },
  { icon: Package01Icon, label: "Mes packs", href: "/user-dashboard/orders" },
  { icon: Invoice01Icon, label: "Mes commandes", href: "/user-dashboard/orders-single" },
  { icon: ShoppingCart01Icon, label: "Panier", href: "/user-dashboard/cart" },
  { icon: FavouriteIcon, label: "Favoris", href: "/user-dashboard/favorites" },
  { icon: CreditCardIcon, label: "Transactions", href: "/user-dashboard/transactions" },
  { icon: UserIcon, label: "Profil", href: "/user-dashboard/profile" },
  { icon: Notification01Icon, label: "Notifications", href: "/user-dashboard/notifications" },
];

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
            <SidebarMenuButton
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              tooltip="Supprimer mon compte"
            >
              <HugeiconsIcon icon={Delete01Icon} size={20} color="currentColor" />
              <span>Supprimer mon compte</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
