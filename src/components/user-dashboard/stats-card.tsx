"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  icon: IconSvgElement;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  index?: number;
}

export function StatsCard({ icon: Icon, label, value, trend, trendUp }: StatsCardProps) {
  return (
    <Card className="@container/card bg-linear-to-t from-primary/5 to-card shadow-xs dark:bg-card">
      <CardHeader className="relative">
        <CardDescription className="flex items-center gap-2">
          <HugeiconsIcon icon={Icon} size={16} color="currentColor" className="text-muted-foreground" />
          {label}
        </CardDescription>
        <CardTitle className="font-semibold text-2xl tabular-nums @[250px]/card:text-3xl">{value}</CardTitle>
        {trend && (
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className={trendUp ? "text-green-600" : "text-red-600"}>
              {trendUp ? <TrendingUp className="mr-1 size-3" /> : <TrendingDown className="mr-1 size-3" />}
              {trend}
            </Badge>
          </div>
        )}
      </CardHeader>
      {trend && (
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {trendUp ? "En hausse" : "En baisse"} ce mois
            {trendUp ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
