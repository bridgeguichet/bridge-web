"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";

import { EmptyState } from "@/external-components/user-dashboard/empty-state";

export default function OrdersPage() {
  const orders = [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-black text-gray-900 md:text-5xl">Mes packs</h1>
        <p className="mt-2 text-lg text-gray-600">Suivez l'état de vos packs en cours et passés</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Aucun pack"
            description="Vous n'avez pas encore de pack. Explorez nos services pour commencer."
            action={{
              label: "Explorer les services",
              href: "/marketplace#services",
            }}
          />
        ) : (
          <div className="space-y-4">{/* Orders list will be added here */}</div>
        )}
      </motion.div>
    </div>
  );
}
