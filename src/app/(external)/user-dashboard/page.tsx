"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Heart, Package, ShoppingBag, ShoppingCart, Sparkles, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/external-components/user-dashboard/empty-state";
import { StatsCard } from "@/external-components/user-dashboard/stats-card";
import { useCartStore } from "@/features/cart/store";
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
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { data: orders, isLoading: ordersLoading } = useOrders();

  const activeOrders =
    orders?.filter(
      (o) => o.status === "in_progress" || o.status === "pending",
    ) || [];
  const totalSpent =
    orders?.reduce((sum, o) => sum + parseFloat(o.totalAmount || "0"), 0) ?? 0;
  const recentOrders = orders?.slice(0, 3) || [];

  const stats = [
    {
      icon: CreditCard,
      label: "Total dépenses",
      value: ordersLoading ? "..." : `$${totalSpent.toFixed(0)}`,
      trend: `${orders?.length ?? 0} commandes`,
      trendUp: true,
    },
    {
      icon: Package,
      label: "Commandes en cours",
      value: ordersLoading ? "..." : String(activeOrders.length),
      trend: activeOrders.length > 0 ? "Voir le suivi" : "Aucune active",
      trendUp: activeOrders.length > 0,
    },
    {
      icon: Heart,
      label: "Services favoris",
      value: "0",
      trend: "Fonctionnalité à venir",
      trendUp: false,
    },
    {
      icon: TrendingUp,
      label: "Total commandes",
      value: ordersLoading ? "..." : String(orders?.length ?? 0),
      trend: "Depuis le début",
      trendUp: true,
    },
  ];

  const quickActions = [
    {
      icon: ShoppingBag,
      label: "Explorer les services",
      description: "Découvrez nos services populaires",
      href: "/marketplace#services",
      variant: "primary" as const,
    },
    {
      icon: ShoppingCart,
      label: "Voir mon panier",
      description: `${cartCount} article${cartCount > 1 ? "s" : ""} en attente`,
      href: "/user-dashboard/cart",
      variant: "accent" as const,
    },
    {
      icon: Package,
      label: "Mes packs",
      description: "Suivez vos packs en cours",
      href: "/user-dashboard/orders",
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
              <Sparkles className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Espace personnel
              </span>
            </div>
            <h1 className="font-black text-4xl tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Tableau de <span className="text-primary">bord</span>
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const isAccent = action.variant === "accent";

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
                    {/* Background accent subtil au hover */}
                    <div
                      className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                        isAccent ? "bg-accent/5" : "bg-primary/5"
                      }`}
                    />

                    <CardContent className="relative p-6">
                      <div className="flex items-start gap-4">
                        <motion.div
                          whileHover={{ rotate: 3 }}
                          className={`shrink-0 rounded-xl p-3 ${
                            isAccent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </motion.div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-lg text-foreground transition-colors group-hover:text-primary">
                            {action.label}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Orders Section */}
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
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 rounded-lg bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <EmptyState
                icon={Package}
                title="Aucun pack pour le moment"
                description="Vous n'avez pas encore de pack. Explorez nos services pour créer votre premier pack personnalisé."
                action={{
                  label: "Explorer les services",
                  href: "/marketplace#services",
                }}
              />
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => {
                  const statusInfo = ORDER_STATUS_LABELS[order.status] ?? {
                    label: order.status,
                    variant: "outline" as const,
                  };
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Commande #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(
                            order.createdAt as unknown as string,
                          ).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">
                          ${parseFloat(order.totalAmount || "0").toFixed(2)}
                        </span>
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
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
