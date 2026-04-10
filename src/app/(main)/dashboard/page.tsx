"use client";

import { useUsers } from "@/features/users";
import { useTranslation } from "@/lib/i18n/use-translation";

import { DashboardCard } from "./_components/dashboard-card";
import { DASHBOARD_CARDS } from "./_components/dashboard-cards-config";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data: usersData, isLoading: usersLoading } = useUsers({});

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
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">{t("pages.dashboard.title")}</h1>
        <p className="text-muted-foreground">{t("pages.dashboard.description")}</p>
      </div>

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
