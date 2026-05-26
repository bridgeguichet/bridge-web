"use client";

import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";

import { EmptyState } from "@/components/user-dashboard/empty-state";
import { ServiceCard } from "@/features/marketplace/components/service-card";
import { useServices } from "@/features/marketplace/hooks";
import { useFavoritesStore } from "@/features/marketplace/store";

export default function FavoritesPage() {
  const likedIds = useFavoritesStore((state) => state.ids);
  const { data: allServices, isLoading } = useServices();

  const favorites = (allServices ?? []).filter((s) => likedIds.includes(s.id));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <HugeiconsIcon icon={FavouriteIcon} size={24} color="currentColor" className="text-primary" />
          </div>
          <div>
            <h1 className="font-black text-3xl text-gray-900">Mes favoris</h1>
            <p className="text-muted-foreground">
              {favorites.length > 0
                ? `${favorites.length} service${favorites.length > 1 ? "s" : ""} sauvegardé${favorites.length > 1 ? "s" : ""}`
                : "Retrouvez vos services préférés en un clic"}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <EmptyState
            icon={FavouriteIcon}
            title="Aucun favori"
            description="Ajoutez des services à vos favoris pour les retrouver facilement."
            action={{
              label: "Explorer les services",
              href: "/marketplace",
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((service, index) => (
              <ServiceCard key={service.id} service={service} badgeIndex={index} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
