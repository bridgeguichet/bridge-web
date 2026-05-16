"use client";

import { Calculator, Package, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePackBuilderStore } from "@/features/pack-builder/store";
import { useTranslation } from "@/lib/i18n/use-translation";

interface PackSummaryPanelProps {
  packId: string;
}

export function PackSummaryPanel({ packId }: PackSummaryPanelProps) {
  const { t } = useTranslation();
  const items = usePackBuilderStore((state) => state.items);
  const removeItem = usePackBuilderStore((state) => state.removeItem);
  const getTotalAmount = usePackBuilderStore((state) => state.getTotalAmount);
  const pricingMode = usePackBuilderStore((state) => state.pricingMode);

  const totalAmount = getTotalAmount();
  const isBudgetMode = pricingMode === "budget";

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    toast.success("Service retiré du pack");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Résumé de votre pack
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-sm">
            <Package className="mx-auto mb-2 h-12 w-12 text-gray-300" />
            <p>Aucun service sélectionné</p>
            <p className="text-xs">Ajoutez des services pour commencer</p>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm">{item.service?.nameFr}</p>
                    {item.variant && <p className="text-gray-500 text-xs">{item.variant.nameFr}</p>}
                    {!isBudgetMode && (
                      <p className="mt-1 text-gray-600 text-xs">
                        Qté: {item.quantity} × ${item.unitPrice}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {!isBudgetMode && <p className="font-semibold text-gray-900 text-sm">${item.totalPrice}</p>}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-gray-200 border-t pt-4">
              {isBudgetMode ? (
                <div className="flex items-center gap-3 rounded-lg bg-amber-50 p-3">
                  <Calculator className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-semibold text-amber-800 text-sm">{t("packSummary.budgetMode.title")}</p>
                    <p className="text-amber-600 text-xs">{t("packSummary.budgetMode.description")}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-2xl text-primary">${totalAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
