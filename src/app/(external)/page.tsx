"use client";

import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";

import Footer from "@/external-components/footer";
import { HeroHeader } from "@/external-components/header";
import MonPack from "@/external-components/monpack";
import TemoingageSection from "@/external-components/temoignage";
import { CategoryShowcase } from "@/features/marketplace/components/category-showcase";
import { FinalCTA } from "@/features/marketplace/components/final-cta";
import { HeroSection } from "@/features/marketplace/components/hero-section";
import { ServiceCard } from "@/features/marketplace/components/service-card";
import { useCategories, useServices } from "@/features/marketplace/hooks";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

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
    setPage(1);
    scrollToServices();
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, []);

  const allServices = services || [];
  const totalPages = Math.max(1, Math.ceil(allServices.length / PAGE_SIZE));
  const paged = allServices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const allTab = { id: undefined as string | undefined, nameFr: "Tous" };
  const categoryTabs = [allTab, ...(categories || []).slice(0, 6)];

  return (
    <div className="min-h-screen bg-white">
      <HeroHeader />
      <HeroSection onExplore={scrollToServices} />

      <MonPack />

      <CategoryShowcase categories={categories || []} onSelectCategory={handleCategorySelect} />

      {/* ───── Services section ───── */}
      <section ref={servicesRef} id="services" className="bg-white py-14">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Section heading */}
          <div className="mb-8">
            <h2 className="mb-1 font-black text-4xl text-gray-900 tracking-tight">Découvrez les meilleurs services</h2>
            <p className="text-gray-400 text-sm">de Kinshasa</p>
          </div>

          {/* Category tabs */}
          <div className="mb-6 flex flex-wrap items-center gap-1 border-gray-100 border-b pb-4">
            {categoryTabs.map((cat) => (
              <button
                type="button"
                key={cat.id ?? "all"}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setPage(1);
                }}
                className={cn(
                  "rounded-full px-4 py-2 font-medium text-sm transition-colors",
                  selectedCategory === cat.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                {cat.nameFr}
              </button>
            ))}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
              ))}
            </div>
          ) : paged.length > 0 ? (
            <motion.div
              key={`${selectedCategory}-${page}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {paged.map((service, i) => (
                <ServiceCard key={service.id} service={service} featured={i < 4} badgeIndex={i} />
              ))}
            </motion.div>
          ) : (
            <div className="flex h-56 flex-col items-center justify-center text-center">
              <span className="mb-4 text-5xl">🔍</span>
              <p className="font-medium text-gray-600">Aucun service dans cette catégorie</p>
              <button
                type="button"
                onClick={() => setSelectedCategory(undefined)}
                className="mt-3 text-primary text-sm underline"
              >
                Voir tous les services
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-gray-400 disabled:opacity-30"
              >
                ←
              </button>
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setPage(n)}
                  className={cn(
                    "h-9 w-9 rounded-full font-medium text-sm transition-colors",
                    n === page ? "bg-primary text-primary-foreground" : "text-gray-500 hover:bg-gray-100",
                  )}
                >
                  {n}
                </button>
              ))}
              {totalPages > 10 && <span className="px-2 text-gray-400">…</span>}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-gray-400 disabled:opacity-30"
              >
                →
              </button>
            </div>
          )}
        </div>
      </section>

      <TemoingageSection />
      <FinalCTA onExplore={scrollToServices} />
      <Footer />
    </div>
  );
}
