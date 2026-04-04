"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Filter, Package2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ServiceCard } from "./service-card";
import { PackRecommendation } from "./pack-recommendation";
import { SelectionSummary } from "./selection-summary";
import { services, servicePacks } from "../data";
import { detectMatchingPacks, getRelevantServices, groupServicesByCategory, getServiceById, getCategoryTranslationKey } from "../utils";
import { useTranslation } from "@/lib/i18n/use-translation";

interface ServiceSelectionSectionProps {
  userProfile?: string;
}

export function ServiceSelectionSection({ userProfile }: ServiceSelectionSectionProps) {
  const { t } = useTranslation();
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [selectedPacks, setSelectedPacks] = useState<Set<string>>(new Set());
  const [showAllServices, setShowAllServices] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const relevantServices = useMemo(
    () => getRelevantServices(services, userProfile),
    [userProfile],
  );

  const displayedServices = showAllServices ? services : relevantServices;

  const groupedServices = useMemo(
    () => groupServicesByCategory(displayedServices, userProfile),
    [displayedServices, userProfile],
  );

  const matchingPacks = useMemo(
    () => detectMatchingPacks(Array.from(selectedServices), userProfile),
    [selectedServices, userProfile],
  );

  const handleToggleService = (serviceId: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
    } else {
      newSelected.add(serviceId);
    }
    
    const packsToRemove = Array.from(selectedPacks).filter((packId) => {
      const pack = servicePacks.find((p) => p.id === packId);
      return pack?.services.includes(serviceId);
    });
    
    const newSelectedPacks = new Set(selectedPacks);
    for (const packId of packsToRemove) {
      newSelectedPacks.delete(packId);
    }
    
    setSelectedServices(newSelected);
    setSelectedPacks(newSelectedPacks);
  };

  const handleToggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSelectPack = (packId: string) => {
    const pack = servicePacks.find((p) => p.id === packId);
    if (pack) {
      const newSelected = new Set(pack.services);
      const newSelectedPacks = new Set(selectedPacks);
      newSelectedPacks.add(packId);
      
      setSelectedServices(newSelected);
      setSelectedPacks(newSelectedPacks);
    }
  };

  const handleClearSelection = () => {
    setSelectedServices(new Set());
    setSelectedPacks(new Set());
  };

  const selectedServiceObjects = useMemo(
    () =>
      Array.from(selectedServices)
        .map((id) => getServiceById(services, id))
        .filter((s): s is NonNullable<typeof s> => s !== undefined),
    [selectedServices],
  );

  const categoriesArray = Array.from(groupedServices.entries());
  const displayedCategories = showAllServices
    ? categoriesArray
    : categoriesArray.slice(0, 3);

  return (
    <div className="relative">
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {t("services.interface.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("services.interface.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="gap-2">
            <Filter className="w-3 h-3" />
            {t("services.interface.servicesSelected", { count: selectedServices.size })}
          </Badge>
          {!showAllServices && (
            <Badge variant="secondary" className="gap-2">
              <Sparkles className="w-3 h-3" />
              {t("services.interface.recommendedForYou")}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {displayedCategories.map(([category, categoryServices]) => {
            const isExpanded = expandedCategories.has(category) || showAllServices;
            const displayServices = isExpanded
              ? categoryServices
              : categoryServices.slice(0, 3);

            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{t(`services.categories.${getCategoryTranslationKey(category)}`)}</h3>
                  {categoryServices.length > 3 && !showAllServices && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleCategory(category)}
                      className="gap-2"
                    >
                      {isExpanded ? (
                        <>
                          {t("services.interface.viewLess")}
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          {t("services.interface.viewMore", { count: categoryServices.length - 3 })}
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {displayServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isSelected={selectedServices.has(service.id)}
                      onToggle={handleToggleService}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {!showAllServices && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAllServices(true)}
                className="gap-2"
              >
                {t("services.interface.viewAllServices")}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          )}

          {showAllServices && categoriesArray.length > displayedCategories.length && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAllServices(false)}
                className="gap-2"
              >
                {t("services.interface.viewRecommendedServices")}
                <ChevronUp className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <SelectionSummary
              selectedServices={selectedServiceObjects}
              selectedPacks={Array.from(selectedPacks).map((id) => servicePacks.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => p !== undefined)}
              onRemove={handleToggleService}
              onClear={handleClearSelection}
            />

            {matchingPacks.length > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">{t("services.interface.recommendedPacks")}</h3>
                </div>
                {matchingPacks.slice(0, 2).map((pack) => {
                  const includedServices = pack.services.filter((serviceId) =>
                    selectedServices.has(serviceId),
                  );
                  const isSelected = selectedPacks.has(pack.id);
                  return (
                    <PackRecommendation
                      key={pack.id}
                      pack={pack}
                      includedServices={includedServices}
                      onSelect={handleSelectPack}
                      isSelected={isSelected}
                    />
                  );
                })}
              </>
            ) : selectedServices.size === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 p-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-muted mb-3">
                  <Package2 className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">
                  {t("services.interface.discoverPacks")}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t("services.interface.discoverPacksDescription")}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
