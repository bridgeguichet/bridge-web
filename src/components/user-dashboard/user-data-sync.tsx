"use client";

import { useEffect } from "react";

import { useSession } from "@/features/auth/hooks";
import { useCartStore } from "@/features/cart/store";
import { useFavoritesStore } from "@/features/marketplace/store";
import { useTransactionsStore } from "@/features/transactions/store";

export function UserDataSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const setCartUserId = useCartStore((state) => state.setUserId);
  const setFavoritesUserId = useFavoritesStore((state) => state.setUserId);
  const setTransactionsUserId = useTransactionsStore((state) => state.setUserId);

  useEffect(() => {
    setCartUserId(userId);
    setFavoritesUserId(userId);
    setTransactionsUserId(userId);
  }, [userId, setCartUserId, setFavoritesUserId, setTransactionsUserId]);

  return <>{children}</>;
}
