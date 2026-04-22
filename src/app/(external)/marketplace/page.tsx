"use client";

import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

import { CategoryShowcase } from "@/features/marketplace/components/category-showcase";
import { FinalCTA } from "@/features/marketplace/components/final-cta";
import { HeroSection } from "@/features/marketplace/components/hero-section";
import { ServiceCard } from "@/features/marketplace/components/service-card";
import { useCategories, useServices } from "@/features/marketplace/hooks";
import { HeroHeader } from "@/external-components/header";

const PAGE_SIZE = 8;

const FILTER_LABELS = [
  "Catégorie",
  "Options service",
  "Prestataire",
  "Budget",
  "Délai",
];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [topRated, setTopRated] = useState(false);
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
      if (el)
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          100,
        );
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
      <CategoryShowcase
        categories={categories || []}
        onSelectCategory={handleCategorySelect}
      />

      {/* ───── Services section ───── */}
      <section ref={servicesRef} id="services" className="py-14 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Section heading */}
          <div className="mb-8">
            <h2 className="text-4xl font-black tracking-tight text-gray-900 mb-1">
              Découvrez les meilleurs services
            </h2>
            <p className="text-gray-400 text-sm">de Kinshasa</p>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1 flex-wrap mb-6 border-b border-gray-100 pb-4">
            {categoryTabs.map((cat) => (
              <button
                key={cat.id ?? "all"}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setPage(1);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  selectedCategory === cat.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
                )}
              >
                {cat.nameFr}
              </button>
            ))}
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-3 flex-wrap mb-8">
            {FILTER_LABELS.map((label) => (
              <button
                key={label}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-gray-400 transition-colors bg-white"
              >
                {label}
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Top Noté
              </span>
              <button
                role="switch"
                aria-checked={topRated}
                onClick={() => setTopRated((v) => !v)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors duration-200",
                  topRated ? "bg-primary" : "bg-gray-200",
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
                    topRated ? "translate-x-6" : "translate-x-1",
                  )}
                />
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-gray-400 transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filtres
            </button>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-gray-100 animate-pulse h-72"
                />
              ))}
            </div>
          ) : paged.length > 0 ? (
            <motion.div
              key={`${selectedCategory}-${page}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {paged.map((service, i) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  featured={i < 4}
                  badgeIndex={i}
                />
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-56 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <p className="text-gray-600 font-medium">
                Aucun service dans cette catégorie
              </p>
              <button
                onClick={() => setSelectedCategory(undefined)}
                className="mt-3 text-sm text-primary underline"
              >
                Voir tous les services
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-30 transition-colors"
              >
                ←
              </button>
              {Array.from(
                { length: Math.min(totalPages, 10) },
                (_, i) => i + 1,
              ).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={cn(
                    "w-9 h-9 rounded-full text-sm font-medium transition-colors",
                    n === page
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-500 hover:bg-gray-100",
                  )}
                >
                  {n}
                </button>
              ))}
              {totalPages > 10 && <span className="px-2 text-gray-400">…</span>}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-30 transition-colors"
              >
                →
              </button>
            </div>
          )}
        </div>
      </section>

      <FinalCTA onExplore={scrollToServices} />
    </div>
  );
}
