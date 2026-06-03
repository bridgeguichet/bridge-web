"use client";

import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, MapPin, Package, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useServices, useServiceVariants } from "@/features/marketplace/hooks";
import type { ServiceWithDetails, CategoryWithSubs } from "@/features/marketplace/types";
import { usePackBuilderStore } from "@/features/pack-builder/store";
import type { PackItemWithDetails } from "@/features/pack-builder/types";
import type { ServiceVariant } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/use-translation";

interface CategoryServicesGridProps {
  category: CategoryWithSubs;
  packId: string;
}

interface ServiceCardProps {
  service: ServiceWithDetails;
  packId: string;
  category: CategoryWithSubs;
  index: number;
}

function ServiceCard({ service, packId, category, index }: ServiceCardProps) {
  const pricingMode = usePackBuilderStore((state) => state.pricingMode);
  const isBudgetMode = pricingMode === "budget";
  const { t } = useTranslation();
  const { data: variants, isLoading: variantsLoading } = useServiceVariants(service.id);
  const items = usePackBuilderStore((state) => state.items);
  const addItem = usePackBuilderStore((state) => state.addItem);
  const removeItem = usePackBuilderStore((state) => state.removeItem);

  const hasVariants = variants && variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState<ServiceVariant | null>(null);

  useEffect(() => {
    if (hasVariants && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [variants, hasVariants, selectedVariant]);

  const packItem = items.find((item) => item.serviceId === service.id);
  const inPack = !!packItem;

  const displayPrice = selectedVariant ? selectedVariant.priceModifier : service.basePrice;
  const displayUnit = service.priceUnit;

  const handleAdd = () => {
    const unitPrice = selectedVariant ? selectedVariant.priceModifier : service.basePrice;
    const newItem: PackItemWithDetails = {
      id: `local-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      packId,
      serviceId: service.id,
      variantId: selectedVariant?.id ?? null,
      categoryId: category.id,
      quantity: 1,
      unitPrice: String(unitPrice),
      totalPrice: String(unitPrice),
      metadata: {},
      addedAt: new Date(),
      service: service,
      variant: selectedVariant ?? undefined,
      category: category,
    };
    addItem(newItem);
    toast.success(`${service.nameFr}${selectedVariant ? ` — ${selectedVariant.nameFr}` : ""} ajouté au pack`);
  };

  const handleRemove = () => {
    if (packItem) {
      removeItem(packItem.id);
      toast.success(`${service.nameFr} retiré du pack`);
    }
  };

  const variantMeta = selectedVariant ? (selectedVariant.metadata as Record<string, string | number | string[]> | null) : null;

  return (
    <motion.div
      key={service.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        "group flex flex-col rounded-2xl border bg-white shadow-sm transition-all duration-200",
        inPack
          ? "border-primary/40 shadow-primary/10 shadow-md"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md",
      )}
    >
      {/* Card header */}
      <div className="p-5 pb-3">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="mb-1 font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{service.nameFr}</h3>
            <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{service.descriptionFr}</p>
          </div>
          {inPack && (
            <div className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Check className="h-3.5 w-3.5 text-white" />
            </div>
          )}
        </div>

        {/* Variants section */}
        {variantsLoading ? (
          <div className="flex items-center gap-2 py-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
            <span className="text-gray-400 text-xs">Chargement des options...</span>
          </div>
        ) : hasVariants ? (
          <div className="mt-3">
            <p className="mb-2 font-medium text-gray-600 text-xs uppercase tracking-wide">Options disponibles</p>
            <div className="flex flex-wrap gap-1.5">
              {variants.map((variant: ServiceVariant) => {
                const isSelected = selectedVariant?.id === variant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariant(variant);
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all duration-150",
                      isSelected
                        ? "border-primary bg-primary text-white shadow-sm"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 shrink-0" />}
                    <span>{variant.nameFr}</span>
                    {!isBudgetMode && (
                      <span className={cn("font-semibold", isSelected ? "text-white/90" : "text-gray-500")}>
                        ${variant.priceModifier}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected variant metadata */}
            <AnimatePresence mode="wait">
              {variantMeta && (
                <motion.div
                  key={selectedVariant?.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 flex flex-wrap gap-1.5"
                >
                  {variantMeta.capacity && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-blue-700 text-xs">
                      <Users className="h-3 w-3" />
                      {String(variantMeta.capacity)} place{Number(variantMeta.capacity) > 1 ? "s" : ""}
                    </span>
                  )}
                  {variantMeta.luggage && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 text-xs">
                      🧳 {String(variantMeta.luggage)} bagage{Number(variantMeta.luggage) > 1 ? "s" : ""}
                    </span>
                  )}
                  {variantMeta.bedrooms && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-purple-700 text-xs">
                      🛏️ {String(variantMeta.bedrooms)} ch.
                    </span>
                  )}
                  {variantMeta.bathrooms && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-cyan-700 text-xs">
                      🚿 {String(variantMeta.bathrooms)} sdb.
                    </span>
                  )}
                  {variantMeta.area && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-green-700 text-xs">
                      📐 {String(variantMeta.area)}
                    </span>
                  )}
                  {variantMeta.location && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-rose-700 text-xs">
                      <MapPin className="h-3 w-3" />
                      {String(variantMeta.location)}
                    </span>
                  )}
                  {variantMeta.features && Array.isArray(variantMeta.features) && variantMeta.features.slice(0, 3).map((f: string, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-gray-600 text-xs">
                      ✓ {f}
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : null}
      </div>

      {/* Card footer */}
      <div className="mt-auto flex items-center justify-between border-gray-100 border-t px-5 py-3">
        <div>
          {isBudgetMode ? (
            <p className="font-semibold text-amber-600 text-sm">{t("modeSelection.budget.quotePrice")}</p>
          ) : (
            <div>
              <p className="text-gray-400 text-xs">{hasVariants ? "Option sélectionnée" : "À partir de"}</p>
              <p className="font-bold text-gray-900 text-lg leading-tight">
                ${displayPrice}
                <span className="font-normal text-gray-500 text-xs">/{displayUnit}</span>
              </p>
            </div>
          )}
        </div>

        {inPack ? (
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs font-medium">Dans le pack</span>
            <Button
              onClick={handleRemove}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAdd}
            size="sm"
            disabled={hasVariants && !selectedVariant}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export function CategoryServicesGrid({ category, packId }: CategoryServicesGridProps) {
  const { data: services, isLoading } = useServices({ categoryId: category.id });
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 text-center">
        <Package className="mb-3 h-10 w-10 text-gray-300" />
        <p className="font-medium text-gray-500">Aucun service disponible dans cette catégorie</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-1 font-bold text-2xl text-gray-900">{category.nameFr}</h2>
        <p className="text-gray-500 text-sm">Sélectionnez les services dont vous avez besoin dans cette catégorie</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            packId={packId}
            category={category}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
