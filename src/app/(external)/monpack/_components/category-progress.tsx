"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import type { CategoryWithSubs } from "@/features/marketplace/types";
import { cn } from "@/lib/utils";

interface CategoryProgressProps {
  categories: CategoryWithSubs[];
  currentIndex: number;
}

export function CategoryProgress({ categories, currentIndex }: CategoryProgressProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-center font-semibold text-gray-900 text-sm">Progression</h3>
      <div className="flex flex-col items-center gap-0">
        {categories.map((category, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={category.id} className="flex w-full flex-col items-center">
              {/* Step Circle + Label */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-semibold text-xs transition-colors",
                    isCompleted && "border-primary bg-primary text-white",
                    isCurrent && "border-primary bg-white text-primary",
                    isUpcoming && "border-gray-300 bg-white text-gray-400",
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                </motion.div>

                {/* Label below circle */}
                <span
                  className={cn(
                    "mt-1 text-center text-xs font-medium leading-tight max-w-25",
                    isCurrent && "text-gray-900",
                    isCompleted && "text-gray-700",
                    isUpcoming && "text-gray-400",
                  )}
                >
                  {category.nameFr}
                </span>
              </div>

              {/* Vertical Connector */}
              {index < categories.length - 1 && (
                <div className="my-2 w-0.5 bg-gray-200 min-h-6">
                  <div
                    className={cn("w-full bg-primary transition-all duration-500", isCompleted ? "h-full" : "h-0")}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
