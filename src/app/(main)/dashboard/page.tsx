"use client";

import { useCustomerUsers, useServices } from "@/features/admin";
import { useActivityData } from "@/features/analytics";
import { useOrders, useOrderStats } from "@/features/orders";
import { useTranslation } from "@/lib/i18n/use-translation";

import { ActivityChart } from "./_components/activity-chart";
import { DashboardCard } from "./_components/dashboard-card";
import { DASHBOARD_CARDS } from "./_components/dashboard-cards-config";
import { RecentOrders } from "./_components/recent-orders";
import { RecentPackets } from "./_components/recent-packets";
import { StatsSummary } from "./_components/stats-summary";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data: customerUsers, isLoading: usersLoading } = useCustomerUsers();
  const { data: servicesData, isLoading: servicesLoading } = useServices();

  // Fetch real data from database
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: orderStats, isLoading: statsLoading } = useOrderStats();
  const { data: activityData, isLoading: activityLoading } = useActivityData("90");

  // Calculate derived values from real data
  const revenue = orderStats?.totalRevenue ?? 0;
  const ordersCount = orderStats?.orderCount ?? 0;
  const packetsCount = orderStats?.packCount ?? 0;

  const isLoading = usersLoading || servicesLoading || ordersLoading || statsLoading;

  const getCardData = (countKey?: "organizations" | "users") => {
    switch (countKey) {
      case "users":
        return {
          count: customerUsers?.length ?? 0,
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
        orders={ordersCount}
        packets={packetsCount}
        services={servicesData?.length || 0}
        clients={customerUsers?.length ?? 0}
        isLoading={isLoading}
      />

      <ActivityChart
        data={activityData?.map((d) => ({ date: d.date, value: d.visitors })) ?? []}
        isLoading={activityLoading}
      />

      <RecentOrders
        orders={orders?.filter((o) => o.type === "order").slice(0, 5) ?? []}
        isLoading={ordersLoading}
      />

      <RecentPackets
        orders={orders?.filter((o) => o.type === "pack").slice(0, 5) ?? []}
        isLoading={ordersLoading}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {DASHBOARD_CARDS.map((card) => {
          const { count, isLoading: cardLoading } = getCardData(card.countKey);
          return (
            <DashboardCard
              key={card.href}
              titleKey={card.titleKey}
              descriptionKey={card.descriptionKey}
              href={card.href}
              icon={card.icon}
              count={count}
              isLoading={cardLoading}
            />
          );
        })}
      </div>
    </div>
  );
}
