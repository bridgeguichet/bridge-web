"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, LogOut, Menu, Search, Settings, User, UserCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/features/auth";
import { useLogout } from "@/features/auth/hooks";
import { cn } from "@/lib/utils";

interface UserHeaderProps {
  onMenuToggle?: () => void;
}

export function UserHeader({ onMenuToggle }: UserHeaderProps) {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { mutate: logout } = useLogout();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isGuest = !currentUser;
  const userAvatar = isGuest
    ? undefined
    : currentUser?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name)}`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden hover:bg-muted" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher services, commandes..."
              className="w-64 border-border bg-muted/50 pl-10 transition-all duration-300 focus:bg-background lg:w-96"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-muted"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Button */}
          <Button variant="ghost" size="icon" className="relative hover:bg-muted" asChild>
            <Link href="/user-dashboard/notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
            </Link>
          </Button>

          {/* User Menu */}
          {isGuest ? (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/auth/login">
                <UserCircle className="h-6 w-6" />
              </Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 overflow-hidden rounded-full p-0 ring-2 ring-transparent transition-all hover:ring-primary/20"
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={currentUser?.name || "User"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="h-6 w-6" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{currentUser?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/user-dashboard/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user-dashboard/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            className="border-t border-border bg-card px-6 py-4 md:hidden"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher services, commandes..."
                className="w-full border-border bg-muted/50 pl-10"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
