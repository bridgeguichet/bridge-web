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

export function StatsCard({ icon: Icon, label, value, trend, trendUp, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="group relative overflow-hidden border-0 bg-card shadow-md transition-all duration-300 hover:shadow-xl">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <CardContent className="relative p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <h3 className="font-black text-3xl tracking-tight text-foreground">{value}</h3>
              {trend && (
                <p
                  className={cn(
                    "mt-1 text-sm font-semibold",
                    trendUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
                  )}
                >
                  {trend}
                </p>
              )}
            </div>
            <motion.div
              whileHover={{ rotate: 6 }}
              className="shrink-0 rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/20"
            >
              <Icon className="h-6 w-6 text-primary" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
