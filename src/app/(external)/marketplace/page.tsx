"use client";

import { useRef, useState } from "react";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { CategoryFilter } from "@/features/marketplace/components/category-filter";
import { CategoryShowcase } from "@/features/marketplace/components/category-showcase";
import { FinalCTA } from "@/features/marketplace/components/final-cta";
import { HeroSection } from "@/features/marketplace/components/hero-section";
import { HowItWorks } from "@/features/marketplace/components/how-it-works";
import { ServiceCardWrapper } from "@/features/marketplace/components/service-card-wrapper";
import { SocialProof } from "@/features/marketplace/components/social-proof";
import { TrustBadges } from "@/features/marketplace/components/trust-badges";
import { useCategories, useServices } from "@/features/marketplace/hooks";

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const { data: categories } = useCategories();
  const { data: services, isLoading } = useServices({
    categoryId: selectedCategory,
  });

  const servicesRef = useRef<HTMLDivElement>(null);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    scrollToServices();
  };

  const featuredServices = services?.slice(0, 6) || [];
  const allServices = services || [];

  return (
    <div className="min-h-screen">
      <HeroSection onExplore={scrollToServices} />

      <CategoryShowcase
        categories={categories || []}
        onSelectCategory={handleCategorySelect}
      />

      {featuredServices.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Services les plus demandés
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez nos services populaires
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    index % 3 === 1 && "md:mt-12",
                    index % 3 === 2 && "md:mt-6",
                  )}
                >
                  <ServiceCardWrapper
                    service={service}
                    index={index}
                    featured={index < 3}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <SocialProof />

      <HowItWorks onGetStarted={scrollToServices} />

      <section ref={servicesRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Tous nos services
            </h2>
            <p className="text-xl text-gray-600">
              Trouvez exactement ce dont vous avez besoin
            </p>
          </motion.div>

          <div className="mb-8">
            <CategoryFilter
              categories={categories || []}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Chargement des services...
                </p>
              </div>
            </div>
          ) : allServices.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {allServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={cn(
                    index % 3 === 1 && "md:mt-12",
                    index % 3 === 2 && "md:mt-6",
                  )}
                >
                  <ServiceCardWrapper service={service} index={index} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl text-gray-600 mb-2">
                  Aucun service disponible dans cette catégorie
                </p>
                <p className="text-gray-500">
                  Essayez une autre catégorie ou explorez tous nos services
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <TrustBadges />

      <FinalCTA onExplore={scrollToServices} />
    </div>
  );
}
