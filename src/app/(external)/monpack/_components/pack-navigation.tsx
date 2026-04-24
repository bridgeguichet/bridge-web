"use client";

import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePackBuilderStore } from "@/features/pack-builder/store";

interface PackNavigationProps {
  currentIndex: number;
  totalCategories: number;
  currentCategoryId: string;
}

export function PackNavigation({
  currentIndex,
  totalCategories,
  currentCategoryId,
}: PackNavigationProps) {
  const previousCategory = usePackBuilderStore((state) => state.previousCategory);
  const nextCategory = usePackBuilderStore((state) => state.nextCategory);
  const skipCategory = usePackBuilderStore((state) => state.skipCategory);
  const items = usePackBuilderStore((state) => state.items);

  const currentCategoryItems = items.filter((item) => item.categoryId === currentCategoryId);
  const canProceed = currentCategoryItems.length > 0;
  const isFirstCategory = currentIndex === 0;
  const isLastCategory = currentIndex === totalCategories - 1;

  const handleSkip = () => {
    skipCategory(currentCategoryId);
    nextCategory();
  };

  const handleNext = () => {
    nextCategory();
  };

  return (
    <div className="mt-12 flex items-center justify-between border-gray-200 border-t bg-white px-6 py-6">
      <Button
        onClick={previousCategory}
        disabled={isFirstCategory}
        variant="outline"
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>

      <div className="flex gap-3">
        <Button onClick={handleSkip} variant="ghost" className="gap-2">
          <SkipForward className="h-4 w-4" />
          Passer cette catégorie
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed && !isLastCategory}
          className="gap-2"
        >
          {isLastCategory ? "Finaliser" : "Continuer"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
