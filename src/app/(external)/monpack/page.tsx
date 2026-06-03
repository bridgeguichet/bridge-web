"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useCategories } from "@/features/marketplace/hooks";
import { usePackBuilderStore } from "@/features/pack-builder/store";
import { useTranslation } from "@/lib/i18n/use-translation";

import { CategoryProgress, CategoryServicesGrid, PackNavigation, PackSummaryPanel } from "./_components";

export default function MonPackPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const currentCategoryIndex = usePackBuilderStore((state) => state.currentCategoryIndex);
  const packId = usePackBuilderStore((state) => state.packId);
  const setPackId = usePackBuilderStore((state) => state.setPackId);
  const items = usePackBuilderStore((state) => state.items);
  const resetPackItems = usePackBuilderStore((state) => state.resetPackItems);

  // Réinitialiser les items au montage mais conserver le pricingMode choisi
  useEffect(() => {
    resetPackItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Créer un pack ID local pour le mode test (pas de base de données)
  useEffect(() => {
    if (!packId) {
      // Générer un ID temporaire local
      const tempPackId = `temp-pack-${Date.now()}`;
      setPackId(tempPackId);
    }
  }, [packId, setPackId]);

  // Calculer les catégories triées et la catégorie courante
  const sortedCategories = (categories || []).sort((a, b) => a.sortOrder - b.sortOrder);
  const currentCategory = sortedCategories[currentCategoryIndex];

  // Rediriger vers la page de paiement si toutes les catégories ont été parcourues
  useEffect(() => {
    if (!currentCategory && sortedCategories.length > 0) {
      router.push("/monpack/paiement");
    }
  }, [currentCategory, sortedCategories.length, router]);

  if (categoriesLoading || !packId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-gray-600">Préparation de votre pack personnalisé...</p>
          <p className="mt-2 text-gray-400 text-xs">Mode test - Pas de connexion requise</p>
        </div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-gray-600">Redirection vers le paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-gray-200 border-b bg-white">
        <div className="container mx-auto px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => {
                if (items.length > 0) {
                  resetPackItems();
                }
                router.push("/monpack/mode");
              }}
              size="sm"
              className="gap-2 bg-transparent text-secondary hover:text-primary hover:bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <h1 className="font-bold text-xl text-gray-900">{t("monpackSection.title")}</h1>
            <Logo className="h-15 w-auto" />
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar Stepper */}
      <div className="container mx-auto px-6 py-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr_340px]">
          {/* Left: Vertical Stepper */}
          <div>
            <CategoryProgress categories={sortedCategories} currentIndex={currentCategoryIndex} />
          </div>

          {/* Center: Services Grid */}
          <div>
            <CategoryServicesGrid category={currentCategory} packId={packId} />
          </div>

          {/* Right: Pack Summary (Sticky) */}
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <PackSummaryPanel packId={packId} />
          </div>

          {/* Bottom Navigation */}
          <div className="lg:col-start-2 lg:col-span-2">
            <PackNavigation
              currentIndex={currentCategoryIndex}
              totalCategories={sortedCategories.length}
              currentCategoryId={currentCategory.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
