"use client";

import { useMemo } from "react";

import Link from "next/link";

import { Invoice01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/user-dashboard/empty-state";
import { useTransactionsStore } from "@/features/transactions/store";

const STATUS_LABELS: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: { label: "En attente", variant: "secondary" },
  completed: { label: "Terminée", variant: "outline" },
  failed: { label: "Échouée", variant: "destructive" },
  refunded: { label: "Remboursée", variant: "destructive" },
};

export default function CommandesPage() {
  const allTransactions = useTransactionsStore((state) => state.transactions);
  const transactions = useMemo(() => allTransactions.filter((t) => t.type === "order"), [allTransactions]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <HugeiconsIcon icon={Invoice01Icon} size={24} color="currentColor" className="text-primary" />
          </div>
          <div>
            <h1 className="font-black text-3xl text-gray-900">Mes commandes</h1>
            <p className="text-muted-foreground">Suivez l&apos;état de vos commandes uniques</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {transactions.length === 0 ? (
          <EmptyState
            icon={Invoice01Icon}
            title="Aucune commande"
            description="Vous n&apos;avez pas encore passé de commande. Explorez nos services pour commencer."
            action={{ label: "Explorer les services", href: "/" }}
          />
        ) : (
          <div className="space-y-3">
            {transactions.map((txn) => {
              const statusInfo = STATUS_LABELS[txn.status] ?? {
                label: txn.status,
                variant: "outline" as const,
              };
              return (
                <Link
                  key={txn.id}
                  href={`/user-dashboard/transactions`}
                  className="flex items-center justify-between rounded-xl border bg-white px-5 py-4 transition-shadow hover:shadow-md"
                >
                  <div>
                    <p className="font-semibold text-gray-900">Commande #{txn.id.slice(4, 12)}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {new Date(txn.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900">${txn.amount.toFixed(2)}</span>
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
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
