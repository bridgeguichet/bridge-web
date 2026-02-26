"use client";

import Link from "next/link";

import { ArrowRight, type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/use-translation";

interface DashboardCardProps {
  titleKey: string;
  descriptionKey: string;
  href: string;
  icon: LucideIcon;
  count?: number | string;
  isLoading?: boolean;
}

export function DashboardCard({
  titleKey,
  descriptionKey,
  href,
  icon: Icon,
  count,
  isLoading = false,
}: DashboardCardProps) {
  const { t } = useTranslation();

  return (
    <Link href={href} className="group">
      <Card className="h-full cursor-pointer border-2 transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-muted-foreground text-sm transition-colors group-hover:text-primary">
            {t(titleKey)}
          </CardTitle>
          <div className="rounded-full bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="font-bold text-4xl">{isLoading ? "..." : (count ?? "-")}</div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
          </div>
          <p className="mt-2 text-muted-foreground text-sm">{isLoading ? t("common.loading") : t(descriptionKey)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
