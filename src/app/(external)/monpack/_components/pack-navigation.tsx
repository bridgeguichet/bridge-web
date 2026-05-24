"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePackBuilderStore } from "@/features/pack-builder/store";
import { useTranslation } from "@/lib/i18n/use-translation";

interface PackNavigationProps {
  currentIndex: number;
  totalCategories: number;
  currentCategoryId: string;
}

export function PackNavigation({ currentIndex, totalCategories, currentCategoryId }: PackNavigationProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const previousCategory = usePackBuilderStore((state) => state.previousCategory);
  const nextCategory = usePackBuilderStore((state) => state.nextCategory);
  const skipCategory = usePackBuilderStore((state) => state.skipCategory);
  const items = usePackBuilderStore((state) => state.items);
  const pricingMode = usePackBuilderStore((state) => state.pricingMode);

  const isBudgetMode = pricingMode === "budget";

  const currentCategoryItems = items.filter((item) => item.categoryId === currentCategoryId);
  const canProceed = currentCategoryItems.length > 0;
  const hasItemsInPack = items.length > 0;
  const isFirstCategory = currentIndex === 0;
  const isLastCategory = currentIndex === totalCategories - 1;

  const handleSkip = () => {
    skipCategory(currentCategoryId);
    nextCategory();
  };

  const handleNext = () => {
    if (isLastCategory) {
      // Vérifier qu'il y a au moins un service dans le pack
      if (!hasItemsInPack) {
        toast.error(t("packNavigation.errorNoServices"));
        return;
      }
      // Rediriger vers l'étape budget (mode budget) ou conseiller (mode prix)
      if (isBudgetMode) {
        router.push("/monpack/budget");
      } else {
        router.push("/monpack/conseiller");
      }
    } else {
      nextCategory();
    }
  };

  return (
    <div className="mt-12 flex items-center justify-between border-gray-200 border-t bg-white px-6 py-6">
      <Button onClick={previousCategory} disabled={isFirstCategory} variant="outline" className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>

      <div className="flex gap-3">
        {!isLastCategory && (
          <Button onClick={handleSkip} variant="ghost" className="gap-2">
            <SkipForward className="h-4 w-4" />
            Passer cette catégorie
          </Button>
        )}

        <Button
          onClick={handleNext}
          disabled={(!canProceed && !isLastCategory) || (isLastCategory && !hasItemsInPack)}
          className="gap-2"
        >
          {isLastCategory ? "Finaliser" : "Continuer"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
