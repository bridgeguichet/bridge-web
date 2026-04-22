"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  index?: number;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  index = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{label}</p>
              <h3 className="mt-2 text-3xl font-black text-primary">{value}</h3>
              {trend && (
                <p
                  className={cn(
                    "mt-2 text-sm font-semibold",
                    trendUp ? "text-green-600" : "text-red-600",
                  )}
                >
                  {trend}
                </p>
              )}
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
