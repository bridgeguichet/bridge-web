"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  Heart,
  Package,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/external-components/user-dashboard/empty-state";
import { StatsCard } from "@/external-components/user-dashboard/stats-card";
import { useCartStore } from "@/features/cart/store";

export default function UserDashboard() {
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const stats = [
    {
      icon: CreditCard,
      label: "Total dépenses",
      value: "$2,450",
      trend: "+12% ce mois",
      trendUp: true,
    },
    {
      icon: Package,
      label: "Commandes en cours",
      value: "3",
      trend: "2 en livraison",
      trendUp: true,
    },
    {
      icon: Heart,
      label: "Services favoris",
      value: "8",
      trend: "+2 cette semaine",
      trendUp: true,
    },
    {
      icon: TrendingUp,
      label: "Transactions ce mois",
      value: "12",
      trend: "+4 vs mois dernier",
      trendUp: true,
    },
  ];

  const quickActions = [
    {
      icon: ShoppingBag,
      label: "Explorer les services",
      description: "Découvrez nos services populaires",
      href: "/marketplace",
      color: "bg-primary",
    },
    {
      icon: ShoppingCart,
      label: "Voir mon panier",
      description: `${cartCount} article${cartCount > 1 ? "s" : ""} en attente`,
      href: "/user-dashboard/cart",
      color: "bg-accent",
    },
    {
      icon: Package,
      label: "Mes commandes",
      description: "Suivez vos commandes en cours",
      href: "/user-dashboard/orders",
      color: "bg-primary",
    },
  ];

  const recentOrders = [];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-black text-gray-900 md:text-5xl">
          Tableau de bord
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Bienvenue sur votre espace personnel
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={stat.label} {...stat} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Link href={action.href}>
                <Card className="cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`rounded-lg ${action.color} p-3 text-white`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">
                          {action.label}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-black">
              Commandes récentes
            </CardTitle>
            <Button variant="ghost" asChild>
              <Link href="/user-dashboard/orders">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <EmptyState
                icon={Package}
                title="Aucune commande"
                description="Vous n'avez pas encore passé de commande. Explorez nos services pour commencer."
                action={{
                  label: "Explorer les services",
                  href: "/marketplace",
                }}
              />
            ) : (
              <div className="space-y-4">
                {/* Orders list will be added here */}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
