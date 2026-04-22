"use client";

import { motion } from "framer-motion";

import type { CategoryWithSubs } from "../types";

interface CategoryShowcaseProps {
  categories: CategoryWithSubs[];
  onSelectCategory: (categoryId: string) => void;
}

const CATEGORY_STYLES: Record<string, { bg: string; illustration: string }> = {
  car: { bg: "#6C6EDD", illustration: "🚗" },
  home: { bg: "#8B2039", illustration: "🏠" },
  users: { bg: "#2A7A2A", illustration: "👥" },
  briefcase: { bg: "#C85A00", illustration: "💼" },
  bell: { bg: "#5A6E00", illustration: "🔔" },
};

const FALLBACK_STYLES = [
  { bg: "#6C6EDD", illustration: "✨" },
  { bg: "#8B2039", illustration: "🌟" },
  { bg: "#2A7A2A", illustration: "💫" },
  { bg: "#C85A00", illustration: "🎉" },
  { bg: "#5A6E00", illustration: "🎈" },
  { bg: "#1A5A7A", illustration: "💡" },
];

export function CategoryShowcase({
  categories,
  onSelectCategory,
}: CategoryShowcaseProps) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category, index) => {
            const style =
              CATEGORY_STYLES[category.icon || ""] ||
              FALLBACK_STYLES[index % FALLBACK_STYLES.length];
            const count =
              (category.subcategories?.length || 0) > 0
                ? `${category.subcategories!.length * 20}+ services`
                : "100+ services";

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectCategory(category.id)}
                className="group rounded-2xl overflow-hidden text-left shadow-sm hover:shadow-xl transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* Illustration zone */}
                <div
                  className="relative h-36 flex items-center justify-center"
                  style={{ backgroundColor: style.bg }}
                >
                  <span className="text-7xl select-none" role="img" aria-hidden>
                    {style.illustration}
                  </span>
                </div>

                {/* Label zone */}
                <div
                  className="px-4 py-3"
                  style={{ backgroundColor: style.bg }}
                >
                  <p className="text-sm font-bold text-white leading-tight line-clamp-2">
                    {category.nameFr}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {count}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
