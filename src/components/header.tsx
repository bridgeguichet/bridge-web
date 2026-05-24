"use client";
import React from "react";

import Link from "next/link";

import { LayoutDashboard, LogIn, LogOut, Menu, ShoppingCart, User, UserCircle, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthRedirect, useLogout, useSession } from "@/features/auth/hooks";
import { useAuthStore } from "@/features/auth/store";
import { CartSheet } from "@/features/cart/components/cart-sheet";
import { useCartStore } from "@/features/cart/store";
import { cn } from "@/lib/utils";

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { t } = useTranslation();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { isAuthenticated } = useSession();
  const logout = useLogout();
  const { redirectToLogin } = useAuthRedirect();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  // Get user initials for avatar
  const currentUser = useAuthStore((state) => state.currentUser);
  const getUserInitials = () => {
    if (!currentUser?.name) return "?";
    const parts = currentUser.name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const menuItems = [
    {
      name: t("external-header.about"),
      href: "https://www.bridgeguichet.net/a-propos",
    },
    { name: t("external-header.service"), href: "/marketplace#services" },
    { name: t("external-header.temoignage"), href: "/marketplace#services" },
  ];

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        className={cn(
          "fixed top-0 z-50 w-full border-b transition-all duration-500",
          isScrolled ? "bg-white/80 shadow-sm backdrop-blur-md" : "border-gray-200 bg-white",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-12">
              <Link href="/" className="flex items-center">
                <Logo />
              </Link>

              <ul className="hidden items-center gap-10 lg:flex">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="font-medium text-gray-700 text-sm transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />

              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full hover:bg-gray-100"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {mounted && itemCount > 0 && (
                  <span className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xs">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Button>
              <CartSheet open={cartOpen} onOpenChange={setCartOpen} />

              <DropdownMenu
                open={userMenuOpen}
                onOpenChange={(open) => {
                  if (open && !isAuthenticated) {
                    redirectToLogin("/");
                    return;
                  }
                  setUserMenuOpen(open);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-10 w-10 rounded-full", isAuthenticated ? "bg-muted" : "hover:bg-gray-100")}
                  >
                    {isAuthenticated ? (
                      <span className="font-semibold text-muted-foreground text-sm">{getUserInitials()}</span>
                    ) : (
                      <User className="h-5 w-5 text-gray-700" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  {isAuthenticated && (
                    <>
                      <DropdownMenuLabel className="flex flex-col gap-0.5 pb-2">
                        <span className="font-semibold text-sm text-foreground">{currentUser?.name}</span>
                        <span className="font-normal text-muted-foreground text-xs">{currentUser?.email}</span>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/user-dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Mon espace
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user-dashboard/profile" className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4" />
                      Mon profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {isAuthenticated ? (
                    <DropdownMenuItem
                      className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
                      onClick={() => logout.mutate()}
                    >
                      <LogOut className="h-4 w-4" />
                      Se déconnecter
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login" className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        {t("auth.login")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <button type="button" onClick={() => setMenuState(!menuState)} className="ml-2 lg:hidden">
                {menuState ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
              </button>
            </div>
          </div>
        </div>

        {menuState && (
          <div className="border-t bg-white lg:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <ul className="space-y-3">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuState(false)}
                      className="block py-2 font-medium text-base text-gray-700 hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
