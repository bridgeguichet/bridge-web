"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import { EmptyState } from "@/external-components/user-dashboard/empty-state";

export default function FavoritesPage() {
  const favorites = [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-black text-gray-900 md:text-5xl">Mes favoris</h1>
        <p className="mt-2 text-lg text-gray-600">Retrouvez vos services préférés en un clic</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {favorites.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Aucun favori"
            description="Ajoutez des services à vos favoris pour les retrouver facilement."
            action={{
              label: "Explorer les services",
              href: "/marketplace#services",
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Favorites grid will be added here */}
          </div>
        )}
      </motion.div>
    </div>
  );
}
