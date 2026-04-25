"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { motion } from "framer-motion";
import { Bell, CreditCard, Heart, LayoutDashboard, ShoppingBag, ShoppingCart, Trash2, User } from "lucide-react";

import { Logo } from "@/components/logo";
import { useCartStore } from "@/features/cart/store";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", href: "/user-dashboard" },
  { icon: ShoppingBag, label: "Mes packs", href: "/user-dashboard/orders" },
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
    <aside className="fixed left-0 top-0 z-30 h-screen w-72 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Header avec logo */}
        <div className="border-b border-border p-6">
          <Link href="/" className="group flex items-center gap-3">
            <Logo />
          </Link>
        </div>

        {/* Navigation */}
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
                  transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                      isActive
                        ? "bg-primary font-semibold text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <motion.div whileHover={!isActive ? { rotate: 6 } : undefined} className="shrink-0">
                      <Icon className="h-5 w-5" />
                    </motion.div>
                    <span className="truncate">{item.label}</span>
                    {showBadge && (
                      <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                        {cartCount}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl bg-primary"
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

        {/* Footer avec suppression de compte */}
        <div className="border-t border-border p-4">
          <button
            type="button"
            className="group flex w-full items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3 transition-all hover:border-red-300 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/20 dark:hover:border-red-900/50 dark:hover:bg-red-950/30"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 transition-colors group-hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:group-hover:bg-red-900/40">
              <Trash2 className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">Supprimer mon compte</p>
              <p className="text-xs text-red-600/70 dark:text-red-400/70">Cette action est irréversible</p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
