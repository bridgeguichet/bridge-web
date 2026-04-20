"use client";

import { motion } from "framer-motion";
import { Car, Home, Users, Briefcase, Bell } from "lucide-react";

import type { CategoryWithSubs } from "../types";

interface CategoryShowcaseProps {
  categories: CategoryWithSubs[];
  onSelectCategory: (categoryId: string) => void;
}

const iconMap: Record<string, any> = {
  car: Car,
  home: Home,
  users: Users,
  briefcase: Briefcase,
  bell: Bell,
};

export function CategoryShowcase({
  categories,
  onSelectCategory,
}: CategoryShowcaseProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black mb-4">Explorez nos services</h2>
          <p className="text-xl text-gray-600">
            Trouvez exactement ce dont vous avez besoin
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.slice(0, 5).map((category, index) => {
            const Icon = iconMap[category.icon || "briefcase"];
            const isPopular = index < 2;

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectCategory(category.id)}
                className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-left group overflow-hidden"
              >
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                {isPopular && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Populaire
                  </div>
                )}

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.nameFr}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {category.subcategories?.length || 0} services disponibles
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
