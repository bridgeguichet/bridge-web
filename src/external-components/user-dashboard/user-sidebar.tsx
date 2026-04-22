"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Bell,
  CreditCard,
  Heart,
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

import { Logo } from "@/components/logo";
import { useCartStore } from "@/features/cart/store";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", href: "/user-dashboard" },
  { icon: ShoppingBag, label: "Mes commandes", href: "/user-dashboard/orders" },
  { icon: ShoppingCart, label: "Panier", href: "/user-dashboard/cart" },
  { icon: Heart, label: "Favoris", href: "/user-dashboard/favorites" },
  { icon: CreditCard, label: "Transactions", href: "/user-dashboard/transactions" },
  { icon: User, label: "Profil", href: "/user-dashboard/profile" },
  { icon: Bell, label: "Notifications", href: "/user-dashboard/notifications" },
];

export function UserSidebar() {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-72 border-r bg-white">
      <div className="flex h-full flex-col">
        <div className="border-b p-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const showBadge = item.href === "/user-dashboard/cart" && cartCount > 0;

              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-white shadow-md"
                        : "text-gray-700 hover:bg-accent/10 hover:text-primary",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {showBadge && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary">
                        {cartCount}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-lg bg-primary"
                        style={{ zIndex: -1 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t p-4">
          <Link
            href="/marketplace"
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-primary px-4 py-3 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white"
          >
            ← Retour au Marketplace
          </Link>
        </div>
      </div>
    </aside>
  );
}
