"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/external-components/user-dashboard/empty-state";
import { useOrders } from "@/features/orders/hooks";

const ORDER_STATUS_LABELS: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: { label: "En attente", variant: "secondary" },
  in_progress: { label: "En cours", variant: "default" },
  completed: { label: "Terminée", variant: "outline" },
  cancelled: { label: "Annulée", variant: "destructive" },
};

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useOrders();

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
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Aucune commande"
            description="Vous n'avez pas encore passé de commande. Explorez nos services pour commencer."
            action={{ label: "Explorer les services", href: "/marketplace" }}
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const statusInfo = ORDER_STATUS_LABELS[order.status] ?? {
                label: order.status,
                variant: "outline" as const,
              };
              return (
                <Link
                  key={order.id}
                  href={`/user-dashboard/orders/${order.id}`}
                  className="flex items-center justify-between rounded-xl border bg-white px-5 py-4 hover:shadow-md transition-shadow"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      Commande #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(
                        order.createdAt as unknown as string,
                      ).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900">
                      ${parseFloat(order.totalAmount || "0").toFixed(2)}
                    </span>
                    <Badge variant={statusInfo.variant}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
