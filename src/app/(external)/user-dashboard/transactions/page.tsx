"use client";

import Link from "next/link";
import { useState } from "react";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Cash01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  CreditCardIcon,
  FilterIcon,
  Package01Icon,
  SmartPhone01Icon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/user-dashboard/empty-state";
import { useTransactions, useTransactionStats } from "@/features/transactions";
import type { Transaction, TransactionStatus, TransactionType } from "@/features/transactions";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  TransactionStatus,
  { label: string; icon: any; color: string }
> = {
  pending: { label: "En attente", icon: Clock01Icon, color: "text-amber-500 bg-amber-50" },
  completed: { label: "Complété", icon: CheckmarkCircle01Icon, color: "text-emerald-500 bg-emerald-50" },
  failed: { label: "Échoué", icon: CancelCircleIcon, color: "text-red-500 bg-red-50" },
  refunded: { label: "Remboursé", icon: Cash01Icon, color: "text-blue-500 bg-blue-50" },
};

const typeConfig: Record<TransactionType, { label: string; icon: any }> = {
  order: { label: "Commande", icon: Package01Icon },
  pack: { label: "Pack", icon: Package01Icon },
  subscription: { label: "Abonnement", icon: CreditCardIcon },
  refund: { label: "Remboursement", icon: Cash01Icon },
};

const paymentMethodIcons: Record<string, any> = {
  mobile_money: SmartPhone01Icon,
  card: CreditCardIcon,
  cash: Cash01Icon,
  bank_transfer: ArrowRight01Icon,
};

function TransactionCard({ transaction }: { transaction: Transaction }) {
  const status = statusConfig[transaction.status];
  const type = typeConfig[transaction.type];
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;
  const PaymentIcon = paymentMethodIcons[transaction.paymentMethod] || CreditCardIcon;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <HugeiconsIcon icon={TypeIcon} size={24} color="currentColor" className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{transaction.description || type.label}</p>
                <p className="text-sm text-muted-foreground">{transaction.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-gray-900">{transaction.amount.toFixed(2)} USD</p>
              <Badge variant="secondary" className={cn("mt-1", status.color)}>
                <HugeiconsIcon icon={StatusIcon} size={12} color="currentColor" className="mr-1" />
                {status.label}
              </Badge>
            </div>
          </div>

          {transaction.items.length > 0 && (
            <div className="mt-4 space-y-2">
              <Separator />
              <div className="space-y-2">
                {transaction.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">{item.totalPrice.toFixed(2)} USD</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <HugeiconsIcon icon={PaymentIcon} size={16} color="currentColor" />
                <span className="capitalize">{transaction.paymentMethod.replace("_", " ")}</span>
              </div>
              <span>{new Date(transaction.createdAt).toLocaleDateString("fr-FR")}</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/user-dashboard/transactions/${transaction.id}`}>Détails</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: any;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-black mt-1">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <HugeiconsIcon icon={Icon} size={20} color="currentColor" className="text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TransactionsPage() {
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");

  const { transactions, totalCount, totalSpent } = useTransactions({
    status: statusFilter === "all" ? undefined : statusFilter,
    type: typeFilter === "all" ? undefined : typeFilter,
  });

  const stats = useTransactionStats();

  return (
    <div className="space-y-6">
      <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <HugeiconsIcon icon={CreditCardIcon} size={24} color="currentColor" className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Mes transactions</h1>
              <p className="text-muted-foreground">
                Consultez l&apos;historique de vos paiements
              </p>
            </div>
          </div>
        </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard title="Total dépensé" value={`${totalSpent.toFixed(2)} USD`} icon={CreditCardIcon} />
        <StatsCard title="Transactions" value={stats.totalTransactions.toString()} subtitle={`${stats.completedCount} complétées`} icon={Package01Icon} />
        <StatsCard title="Ce mois" value={`${stats.thisMonthSpent.toFixed(2)} USD`} icon={Cash01Icon} />
        <StatsCard title="En attente" value={stats.pendingCount.toString()} icon={Clock01Icon} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={FilterIcon} size={16} color="currentColor" className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtrer:</span>
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TransactionStatus | "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="completed">Complété</SelectItem>
            <SelectItem value="failed">Échoué</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TransactionType | "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="order">Commandes</SelectItem>
            <SelectItem value="pack">Packs</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        {transactions.length === 0 ? (
          <EmptyState
            icon={CreditCardIcon}
            title="Aucune transaction"
            description="Vos transactions apparaîtront ici une fois que vous aurez passé votre première commande."
            action={{
              label: "Explorer les services",
              href: "/",
            }}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {totalCount} transaction{totalCount > 1 ? "s" : ""}
            </p>
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <TransactionCard transaction={transaction} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
