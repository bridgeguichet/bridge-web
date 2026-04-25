"use client";

import Link from "next/link";
import { useState } from "react";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  Filter,
  Package,
  Smartphone,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/external-components/user-dashboard/empty-state";
import { useTransactions, useTransactionStats } from "@/features/transactions";
import type { Transaction, TransactionStatus, TransactionType } from "@/features/transactions";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  TransactionStatus,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  pending: { label: "En attente", icon: Clock, color: "text-amber-500 bg-amber-50" },
  completed: { label: "Complété", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50" },
  failed: { label: "Échoué", icon: XCircle, color: "text-red-500 bg-red-50" },
  refunded: { label: "Remboursé", icon: Banknote, color: "text-blue-500 bg-blue-50" },
};

const typeConfig: Record<TransactionType, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  order: { label: "Commande", icon: Package },
  pack: { label: "Pack", icon: Package },
  subscription: { label: "Abonnement", icon: CreditCard },
  refund: { label: "Remboursement", icon: Banknote },
};

const paymentMethodIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  mobile_money: Smartphone,
  card: CreditCard,
  cash: Banknote,
  bank_transfer: ArrowRight,
};

function TransactionCard({ transaction }: { transaction: Transaction }) {
  const status = statusConfig[transaction.status];
  const type = typeConfig[transaction.type];
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;
  const PaymentIcon = paymentMethodIcons[transaction.paymentMethod] || CreditCard;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <TypeIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{transaction.description || type.label}</p>
                <p className="text-sm text-muted-foreground">{transaction.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-gray-900">{transaction.amount.toFixed(2)} USD</p>
              <Badge variant="secondary" className={cn("mt-1", status.color)}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
            </div>
          </div>

          {/* Items */}
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

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <PaymentIcon className="w-4 h-4" />
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
  icon: React.ComponentType<{ className?: string }>;
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
            <Icon className="w-5 h-5 text-primary" />
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
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-black text-gray-900 md:text-5xl">Mes transactions</h1>
        <p className="mt-2 text-lg text-gray-600">Consultez l'historique de vos paiements</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard title="Total dépensé" value={`${totalSpent.toFixed(2)} USD`} icon={CreditCard} />
        <StatsCard title="Transactions" value={stats.totalTransactions.toString()} subtitle={`${stats.completedCount} complétées`} icon={Package} />
        <StatsCard title="Ce mois" value={`${stats.thisMonthSpent.toFixed(2)} USD`} icon={Banknote} />
        <StatsCard title="En attente" value={stats.pendingCount.toString()} icon={Clock} />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
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
            <SelectItem value="refunded">Remboursé</SelectItem>
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
            <SelectItem value="subscription">Abonnements</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Transactions List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        {transactions.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="Aucune transaction"
            description="Vos transactions apparaîtront ici une fois que vous aurez passé votre première commande."
            action={{
              label: "Explorer les services",
              href: "/marketplace#services",
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
