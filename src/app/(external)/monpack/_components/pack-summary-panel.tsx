"use client";

import { Download, Package, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePackBuilderStore } from "@/features/pack-builder/store";

interface PackSummaryPanelProps {
  packId: string;
}

export function PackSummaryPanel({ packId }: PackSummaryPanelProps) {
  const items = usePackBuilderStore((state) => state.items);
  const removeItem = usePackBuilderStore((state) => state.removeItem);
  const getTotalAmount = usePackBuilderStore((state) => state.getTotalAmount);

  const totalAmount = getTotalAmount();

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    toast.success("Service retiré du pack");
  };

  const handleDownloadInvoice = () => {
    // Mode local - afficher un alert avec le résumé
    const invoiceData = {
      packId,
      items: items.map(item => ({
        name: item.service?.nameFr,
        quantity: item.quantity,
        price: item.totalPrice,
      })),
      total: totalAmount.toFixed(2),
    };
    alert(`Facture temporaire:\n\n${JSON.stringify(invoiceData, null, 2)}`);
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
                    <p className="font-medium text-gray-900 text-sm">
                      {item.service?.nameFr}
                    </p>
                    {item.variant && (
                      <p className="text-gray-500 text-xs">{item.variant.nameFr}</p>
                    )}
                    <p className="mt-1 text-gray-600 text-xs">
                      Qté: {item.quantity} × ${item.unitPrice}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      ${item.totalPrice}
                    </p>
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
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-2xl text-primary">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                onClick={handleDownloadInvoice}
                variant="outline"
                className="w-full gap-2"
                size="sm"
              >
                <Download className="h-4 w-4" />
                Télécharger la facture
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
