"use client";

import Link from "next/link";

import {
  ArrowRight01Icon,
  Cash01Icon,
  Invoice01Icon,
  Package01Icon,
  ShoppingBag01Icon,
  ShoppingCart01Icon,
  SparklesIcon,
  TrendingUpDownIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/user-dashboard/empty-state";
import { StatsCard } from "@/components/user-dashboard/stats-card";
import { useSession } from "@/features/auth/hooks";
import { useCartStore } from "@/features/cart/store";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function UserDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "";
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const transactions = useTransactionsStore((state) => state.transactions);
  const totalSpent = useTransactionsStore((state) => state.getTotalSpent());

  const packTransactions = transactions.filter((t) => t.type === "pack");
  const pendingTransactions = transactions.filter((t) => t.status === "pending");
  const recentPacks = packTransactions.slice(0, 3);

  const stats = [
    {
      icon: Cash01Icon,
      label: "Total dépenses",
      value: `$${totalSpent.toFixed(0)}`,
      trend: `${transactions.length} transactions`,
      trendUp: true,
    },
    {
      icon: Package01Icon,
      label: "Packs créés",
      value: String(packTransactions.length),
      trend: packTransactions.length > 0 ? "Voir le suivi" : "Aucun pack",
      trendUp: packTransactions.length > 0,
    },
    {
      icon: Invoice01Icon,
      label: "En attente",
      value: String(pendingTransactions.length),
      trend: pendingTransactions.length > 0 ? "À traiter" : "Tout est à jour",
      trendUp: pendingTransactions.length === 0,
    },
    {
      icon: TrendingUpDownIcon,
      label: "Total transactions",
      value: String(transactions.length),
      trend: "Depuis le début",
      trendUp: true,
    },
  ];

  const quickActions = [
    {
      icon: ShoppingBag01Icon,
      label: "Explorer les services",
      description: "Découvrez nos services populaires",
      href: "/",
      variant: "primary" as const,
    },
    {
      icon: ShoppingCart01Icon,
      label: "Voir mon panier",
      description: `${cartCount} article${cartCount > 1 ? "s" : ""} en attente`,
      href: "/user-dashboard/cart",
      variant: "primary" as const,
    },
    {
      icon: Package01Icon,
      label: "Mes packs",
      description: "Suivez vos packs en cours",
      href: "/user-dashboard/orders",
      variant: "primary" as const,
    },
    {
      icon: Invoice01Icon,
      label: "Mes commandes",
      description: "Suivez vos commandes uniques",
      href: "/user-dashboard/orders-single",
      variant: "primary" as const,
    },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">
      {/* Hero Section avec asymétrie */}
      <motion.div variants={itemVariants} className="relative">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={SparklesIcon} size={20} color="currentColor" className="text-accent" />
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Espace personnel
              </span>
            </div>
            <h1 className="font-black text-4xl tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Bienvenue <span className="text-primary">{userName}</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              Bienvenue sur votre espace. Gérez vos packs, suivez vos transactions et découvrez nos services.
            </p>
          </div>

          {/* Badge stat flottante */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="mt-4 hidden lg:block"
          >
            <div className="flex items-center gap-3 rounded-2xl bg-card px-5 py-3 shadow-lg">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
              </span>
              <span className="text-sm font-medium text-foreground">Pack actif en cours</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard key={stat.label} {...stat} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Quick Actions avec cards modernes */}
      <motion.div variants={itemVariants} className="space-y-5">
        <h2 className="font-bold text-2xl tracking-tight text-foreground">Actions rapides</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;

            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={action.href} className="group block">
                  <Card className="relative overflow-hidden border-0 bg-card shadow-md transition-all duration-300 hover:shadow-xl">
                    {/* Background subtil au hover */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <CardContent className="relative p-6">
                      <div className="flex items-start gap-4">
                        <motion.div
                          whileHover={{ rotate: 3 }}
                          className="shrink-0 rounded-xl bg-primary p-3 text-primary-foreground"
                        >
                          <HugeiconsIcon icon={Icon} size={24} color="currentColor" />
                        </motion.div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-lg text-foreground transition-colors group-hover:text-primary">
                            {action.label}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                        </div>
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          size={20}
                          color="currentColor"
                          className="shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Packs Section */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 px-6 py-5">
            <div className="space-y-1">
              <CardTitle className="font-black text-xl text-foreground">Packs récents</CardTitle>
              <p className="text-sm text-muted-foreground">Historique de vos derniers packs</p>
            </div>
            <Button
              variant="outline"
              asChild
              className="hidden border-primary/20 hover:bg-primary/5 hover:text-primary sm:flex"
            >
              <Link href="/user-dashboard/orders">
                Voir tout
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" className="ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentPacks.length === 0 ? (
              <EmptyState
                icon={Package01Icon}
                title="Aucun pack pour le moment"
                description="Vous n'avez pas encore de pack. Explorez nos services pour créer votre premier pack personnalisé."
                action={{
                  label: "Créer un pack",
                  href: "/monpack/mode",
                }}
              />
            ) : (
              <div className="space-y-3">
                {recentPacks.map((txn) => {
                  const statusInfo = STATUS_LABELS[txn.status] ?? {
                    label: txn.status,
                    variant: "outline" as const,
                  };
                  return (
                    <div key={txn.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Pack #{txn.id.slice(4, 12)}</p>
                        <p className="text-gray-500 text-xs">{new Date(txn.createdAt).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 text-sm">${txn.amount.toFixed(2)}</span>
                        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
