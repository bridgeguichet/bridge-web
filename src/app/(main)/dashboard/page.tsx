"use client";

import { useMemo } from "react";

import { useServices } from "@/features/admin";
import { useTransactionsStore } from "@/features/transactions/store";
import { useUsers } from "@/features/users";
import { useTranslation } from "@/lib/i18n/use-translation";

import { ActivityChart } from "./_components/activity-chart";
import { DashboardCard } from "./_components/dashboard-card";
import { DASHBOARD_CARDS } from "./_components/dashboard-cards-config";
import { RecentOrders } from "./_components/recent-orders";
import { StatsSummary } from "./_components/stats-summary";

function generateActivityData(): Array<{ date: string; value: number }> {
  const data: Array<{ date: string; value: number }> = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const base = 20 + Math.sin(i * 0.3) * 15;
    const random = Math.random() * 30;
    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.max(0, Math.round(base + random)),
    });
  }
  return data;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data: usersData, isLoading: usersLoading } = useUsers({});
  const { data: servicesData, isLoading: servicesLoading } = useServices();
  const transactions = useTransactionsStore((state) => state.transactions);

  const activityData = useMemo(() => generateActivityData(), []);

  const revenue = useMemo(() => {
    return transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const isLoading = usersLoading || servicesLoading;

  const getCardData = (countKey?: "organizations" | "users") => {
    switch (countKey) {
      case "users":
        return {
          count: usersData?.count || 0,
          isLoading: usersLoading,
        };
      default:
        return { count: undefined, isLoading: false };
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">{t("pages.dashboard.title")}</h1>
        <p className="text-muted-foreground">{t("pages.dashboard.description")}</p>
      </div>

      <StatsSummary
        revenue={revenue}
        orders={transactions.length}
        services={servicesData?.length || 0}
        clients={usersData?.count || 0}
        isLoading={isLoading}
      />

      <ActivityChart data={activityData} isLoading={false} />

      <RecentOrders transactions={transactions} isLoading={false} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {DASHBOARD_CARDS.map((card) => {
          const { count, isLoading } = getCardData(card.countKey);
          return (
            <DashboardCard
              key={card.href}
              titleKey={card.titleKey}
              descriptionKey={card.descriptionKey}
              href={card.href}
              icon={card.icon}
              count={count}
              isLoading={isLoading}
            />
          );
        })}
      </div>
    </div>
  );
}
