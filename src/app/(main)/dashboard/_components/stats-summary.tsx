"use client";

import { CreditCard, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsSummaryProps {
  revenue: number;
  orders: number;
  services: number;
  clients: number;
  isLoading?: boolean;
}

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel: string;
  subDescription: string;
  icon: React.ReactNode;
  badgeLabel: string;
  isLoading?: boolean;
}

function StatCard({ label, value, subLabel, subDescription, icon, badgeLabel, isLoading }: StatCardProps) {
  return (
    <Card className="overflow-hidden border bg-card">
      <CardContent className="p-0">
        <div className="flex items-start justify-between p-5 pb-3">
          <div>
            <p className="text-muted-foreground text-sm font-medium">{label}</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {icon}
            <span>{badgeLabel}</span>
          </div>
        </div>
        <div className="px-5 pb-5">
          {isLoading ? (
            <Skeleton className="h-9 w-28" />
          ) : (
            <div className="text-3xl font-bold tracking-tight">{value}</div>
          )}
        </div>
        <div className="border-t bg-muted/30 px-5 py-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{subLabel}</span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{subDescription}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsSummary({ revenue, orders, services, clients, isLoading }: StatsSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Chiffre d'affaires"
        value={`${revenue.toLocaleString("fr-FR")} CDF`}
        subLabel="Revenus des commandes payées"
        subDescription="Total des ventes confirmées"
        icon={<CreditCard className="h-3.5 w-3.5" />}
        badgeLabel="Payé"
        isLoading={isLoading}
      />
      <StatCard
        label="Commandes"
        value={orders}
        subLabel="Toutes les commandes"
        subDescription="Commandes en cours et livrées"
        icon={<ShoppingCart className="h-3.5 w-3.5" />}
        badgeLabel="Total"
        isLoading={isLoading}
      />
      <StatCard
        label="Produits actifs"
        value={services}
        subLabel="Catalogue disponible"
        subDescription="Produits en stock"
        icon={<Package className="h-3.5 w-3.5" />}
        badgeLabel="En vente"
        isLoading={isLoading}
      />
      <StatCard
        label="Clients"
        value={clients}
        subLabel="Base clients active"
        subDescription="Utilisateurs enregistrés"
        icon={<Users className="h-3.5 w-3.5" />}
        badgeLabel="Inscrits"
        isLoading={isLoading}
      />
    </div>
  );
}
