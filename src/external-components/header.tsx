"use client";
import React from "react";

import Link from "next/link";

import { Menu, ShoppingCart, User, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";
import { ExternalLanguageSwitcher } from "@/external-components/language-switcher";
import { cn } from "@/lib/utils";

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { t } = useTranslation();
  const itemCount = useCartStore((state) => state.getItemCount());

  const menuItems = [
    {
      name: t("external-header.about"),
      href: "https://www.bridgeguichet.net/a-propos",
    },
    { name: t("external-header.service"), href: "/marketplace#services" },
    { name: t("external-header.temoignage"), href: "/marketplace#services" },
  ];

  React.useEffect(() => {
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
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm"
            : "bg-white border-gray-200",
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
                      className="text-sm font-medium text-gray-700 transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <ExternalLanguageSwitcher />

              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100 relative" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100" asChild>
                <Link href="/user-dashboard">
                  <User className="h-5 w-5 text-gray-700" />
                </Link>
              </Button>

              <button onClick={() => setMenuState(!menuState)} className="ml-2 lg:hidden">
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
                      className="block py-2 text-base font-medium text-gray-700 hover:text-primary"
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
