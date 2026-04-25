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
    <div className="border-gray-200 border-b bg-white">
      <div className="container mx-auto px-6 py-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          {categories.map((category, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isUpcoming = index > currentIndex;

            return (
              <div key={category.id} className="flex min-w-0 flex-1 items-center">
                {/* Step */}
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold text-sm transition-colors",
                      isCompleted && "border-primary bg-primary text-white",
                      isCurrent && "border-primary bg-white text-primary",
                      isUpcoming && "border-gray-300 bg-white text-gray-400",
                    )}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
                  </motion.div>
                  <span
                    className={cn(
                      "text-center text-xs font-medium",
                      isCurrent && "text-gray-900",
                      !isCurrent && "text-gray-500",
                    )}
                  >
                    {category.nameFr}
                  </span>
                </div>

                {/* Connector */}
                {index < categories.length - 1 && (
                  <div className="mx-2 h-0.5 flex-1 bg-gray-200">
                    <div
                      className={cn("h-full bg-primary transition-all duration-500", isCompleted ? "w-full" : "w-0")}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
