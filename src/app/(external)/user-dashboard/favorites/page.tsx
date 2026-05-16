"use client";

import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { motion } from "framer-motion";

import { EmptyState } from "@/components/user-dashboard/empty-state";
import { ServiceCard } from "@/features/marketplace/components/service-card";
import { useServices } from "@/features/marketplace/hooks";
import { useFavoritesStore } from "@/features/marketplace/store";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

export default function FavoritesPage() {
  const favoriteIds = useFavoritesStore((state) => state.ids);
  const { data: services, isLoading } = useServices();

  const favoriteServices = services?.filter((service) => favoriteIds.includes(service.id)) ?? [];

  return (
    <div className="space-y-6">
      <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <HugeiconsIcon icon={FavouriteIcon} size={24} color="currentColor" className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Mes favoris</h1>
              <p className="text-muted-foreground">
                Retrouvez vos services préférés en un clic
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
          <div className="flex h-56 items-center justify-center">
            <div className="text-muted-foreground">Chargement...</div>
          </div>
        ) : favoriteServices.length === 0 ? (
          <EmptyState
            icon={FavouriteIcon}
            title="Aucun favori"
            description="Ajoutez des services à vos favoris pour les retrouver facilement."
            action={{
              label: "Explorer les services",
              href: "/marketplace#services",
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteServices.map((service, i) => (
              <ServiceCard key={service.id} service={service} badgeIndex={i} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
