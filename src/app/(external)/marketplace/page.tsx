"use client";

import { useState } from "react";

import { CategoryFilter } from "@/features/marketplace/components/category-filter";
import { ServiceCard } from "@/features/marketplace/components/service-card";
import { useCategories, useServices } from "@/features/marketplace/hooks";

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const { data: categories } = useCategories();
  const { data: services, isLoading } = useServices({
    categoryId: selectedCategory,
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Marketplace BRIDGE</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Découvrez nos services à Kinshasa: mobilité, logement, personnel de maison et plus encore.
      </p>

      <CategoryFilter categories={categories || []} selected={selectedCategory} onSelect={setSelectedCategory} />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Chargement des services...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {services?.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
      )}

      {!isLoading && services?.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Aucun service disponible dans cette catégorie.</p>
        </div>
      )}
    </div>
  );
}
