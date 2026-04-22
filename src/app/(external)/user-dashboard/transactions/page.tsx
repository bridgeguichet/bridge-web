"use client";

import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";

import { EmptyState } from "@/external-components/user-dashboard/empty-state";

export default function TransactionsPage() {
  const transactions = [];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-black text-gray-900 md:text-5xl">
          Mes transactions
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Consultez l'historique de vos paiements
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {transactions.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="Aucune transaction"
            description="Vos transactions apparaîtront ici une fois que vous aurez passé votre première commande."
            action={{
              label: "Explorer les services",
              href: "/marketplace",
            }}
          />
        ) : (
          <div className="space-y-4">
            {/* Transactions list will be added here */}
          </div>
        )}
      </motion.div>
    </div>
  );
}
