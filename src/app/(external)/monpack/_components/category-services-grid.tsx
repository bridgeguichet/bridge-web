"use client";

import { motion } from "framer-motion";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useServices } from "@/features/marketplace/hooks";
import type { CategoryWithSubs } from "@/features/marketplace/types";
import { usePackBuilderStore } from "@/features/pack-builder/store";
import type { PackItemWithDetails } from "@/features/pack-builder/types";
import { useTranslation } from "@/lib/i18n/use-translation";

interface CategoryServicesGridProps {
  category: CategoryWithSubs;
  packId: string;
}

export function CategoryServicesGrid({ category, packId }: CategoryServicesGridProps) {
  const { t } = useTranslation();
  const { data: services, isLoading } = useServices({ categoryId: category.id });
  const items = usePackBuilderStore((state) => state.items);
  const addItem = usePackBuilderStore((state) => state.addItem);
  const pricingMode = usePackBuilderStore((state) => state.pricingMode);

  const isBudgetMode = pricingMode === "budget";

  const handleAddService = (service: any) => {
    // Créer un item local (pas d'appel API)
    const newItem: PackItemWithDetails = {
      id: `local-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      packId,
      serviceId: service.id,
      variantId: null,
      categoryId: category.id,
      quantity: 1,
      unitPrice: service.basePrice,
      totalPrice: service.basePrice,
      metadata: {},
      addedAt: new Date(),
      service: service,
      category: category,
    };

    addItem(newItem);
    toast.success(`${service.nameFr} ajouté au pack`);
  };

  const isServiceInPack = (serviceId: string) => {
    return items.some((item) => item.serviceId === serviceId);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">Aucun service disponible dans cette catégorie</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-2 font-bold text-2xl text-gray-900">{category.nameFr}</h2>
        <p className="text-gray-600 text-sm">Sélectionnez les services dont vous avez besoin dans cette catégorie</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const inPack = isServiceInPack(service.id);

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3">
                <h3 className="mb-1 font-semibold text-gray-900 text-sm line-clamp-2">{service.nameFr}</h3>
                <p className="text-gray-500 text-xs line-clamp-2">{service.descriptionFr}</p>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  {isBudgetMode ? (
                    <p className="font-semibold text-amber-600 text-sm">{t("modeSelection.budget.quotePrice")}</p>
                  ) : (
                    <>
                      <p className="text-xs text-gray-400">À partir de</p>
                      <p className="font-bold text-gray-900 text-lg">
                        ${service.basePrice}
                        <span className="font-normal text-gray-500 text-xs">/{service.priceUnit}</span>
                      </p>
                    </>
                  )}
                </div>

                <Button
                  onClick={() => handleAddService(service)}
                  disabled={inPack}
                  size="sm"
                  variant={inPack ? "secondary" : "default"}
                  className="gap-1"
                >
                  {inPack ? (
                    "Ajouté"
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Ajouter
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
