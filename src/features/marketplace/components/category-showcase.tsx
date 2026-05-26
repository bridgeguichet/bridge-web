"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Notification01Icon, Briefcase01Icon, Car01Icon, Home01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";

import { getCardImageUrl } from "@/lib/cloudinary/client";

import type { CategoryWithSubs } from "../types";

interface CategoryShowcaseProps {
  categories: CategoryWithSubs[];
  onSelectCategory: (categoryId: string) => void;
}

interface CategoryStyle {
  bg: string;
  Icon: IconSvgElement;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  car: { bg: "#6C6EDD", Icon: Car01Icon },
  home: { bg: "#8B2039", Icon: Home01Icon },
  users: { bg: "#2A7A2A", Icon: UserGroupIcon },
  briefcase: { bg: "#C85A00", Icon: Briefcase01Icon },
  bell: { bg: "#5A6E00", Icon: Notification01Icon },
};

const FALLBACK_STYLES: CategoryStyle[] = [
  { bg: "#6C6EDD", Icon: Car01Icon },
  { bg: "#8B2039", Icon: Home01Icon },
  { bg: "#2A7A2A", Icon: UserGroupIcon },
  { bg: "#C85A00", Icon: Briefcase01Icon },
  { bg: "#5A6E00", Icon: Notification01Icon },
  { bg: "#1A5A7A", Icon: Briefcase01Icon },
];

export function CategoryShowcase({ categories, onSelectCategory }: CategoryShowcaseProps) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category, index) => {
            const style = CATEGORY_STYLES[category.icon || ""] || FALLBACK_STYLES[index % FALLBACK_STYLES.length];
            const count =
              (category.subcategories?.length || 0) > 0
                ? `${category.subcategories!.length * 20}+ services`
                : "100+ services";
            const optimizedImageUrl = getCardImageUrl(category.imageUrl, 400, 300);

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
                  className="relative h-36 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: optimizedImageUrl ? undefined : style.bg }}
                >
                  {optimizedImageUrl ? (
                    <img
                      src={optimizedImageUrl}
                      alt={category.nameFr}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <HugeiconsIcon icon={style.Icon} size={64} color="white" />
                  )}
                </div>

                {/* Label zone */}
                <div className="px-4 py-3" style={{ backgroundColor: style.bg }}>
                  <p className="text-sm font-bold text-white leading-tight line-clamp-2">{category.nameFr}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>
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
