"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCategories } from "@/features/marketplace/hooks";
import { usePackBuilderStore } from "@/features/pack-builder/store";
import { useTranslation } from "@/lib/i18n/use-translation";

import {
  CategoryProgress,
  CategoryServicesGrid,
  PackNavigation,
  PackSummaryPanel,
} from "./_components";

export default function MonPackPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const currentCategoryIndex = usePackBuilderStore((state) => state.currentCategoryIndex);
  const packId = usePackBuilderStore((state) => state.packId);
  const setPackId = usePackBuilderStore((state) => state.setPackId);

  // Créer un pack ID local pour le mode test (pas de base de données)
  useEffect(() => {
    if (!packId) {
      // Générer un ID temporaire local
      const tempPackId = `temp-pack-${Date.now()}`;
      setPackId(tempPackId);
    }
  }, [packId, setPackId]);

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

  const sortedCategories = (categories || []).sort((a, b) => a.sortOrder - b.sortOrder);
  const currentCategory = sortedCategories[currentCategoryIndex];

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 font-bold text-3xl text-gray-900">
              Félicitations ! Votre pack est prêt
            </h1>
            <p className="mb-8 text-gray-600">
              Vous avez terminé le parcours de personnalisation. Consultez le résumé de votre pack
              et finalisez votre commande.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => router.push("/")} variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </Button>
            </div>
          </div>
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
              onClick={() => router.push("/")}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <h1 className="font-bold text-xl text-gray-900">
              {t("monpackSection.title")}
            </h1>
            <div className="w-24" />
          </div>
        </div>
      </div>

      {/* Progress */}
      <CategoryProgress
        categories={sortedCategories}
        currentIndex={currentCategoryIndex}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left: Services Grid */}
          <div>
            <CategoryServicesGrid
              category={currentCategory}
              packId={packId}
            />
          </div>

          {/* Right: Pack Summary (Sticky) */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <PackSummaryPanel packId={packId} />
          </div>
        </div>

        {/* Navigation */}
        <PackNavigation
          currentIndex={currentCategoryIndex}
          totalCategories={sortedCategories.length}
          currentCategoryId={currentCategory.id}
        />
      </div>
    </div>
  );
}
