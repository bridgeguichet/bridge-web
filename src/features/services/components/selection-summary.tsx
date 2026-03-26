"use client";

import { Check, Package, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Service, ServicePack } from "../types";

interface SelectionSummaryProps {
  selectedServices: Service[];
  selectedPacks?: ServicePack[];
  onRemove: (serviceId: string) => void;
  onClear: () => void;
}

export function SelectionSummary({
  selectedServices,
  selectedPacks = [],
  onRemove,
  onClear,
}: SelectionSummaryProps) {
  if (selectedServices.length === 0 && selectedPacks.length === 0) return null;

  const totalEstimate = selectedPacks.length > 0
    ? selectedPacks.reduce((sum, pack) => {
        const price = Number.parseFloat(pack.price.replace(/[^0-9.]/g, ""));
        return sum + (Number.isNaN(price) ? 0 : price);
      }, 0)
    : selectedServices.reduce((sum, service) => {
        if (service.price) {
          const price = Number.parseFloat(service.price.replace(/[^0-9.]/g, ""));
          return sum + (Number.isNaN(price) ? 0 : price);
        }
        return sum;
      }, 0);

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Votre sélection</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground"
          >
            Tout effacer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {selectedPacks.length > 0 ? (
            selectedPacks.map((pack) => (
              <div
                key={pack.id}
                className="flex items-start justify-between gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 transition-colors"
              >
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div className="p-1.5 rounded-md bg-green-500/20 text-green-600 shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight">
                      {pack.name}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {pack.services.length} services inclus
                    </p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {pack.price}
                    </Badge>
                  </div>
                </div>
                <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white">
                  <Check className="w-4 h-4" />
                </div>
              </div>
            ))
          ) : (
            selectedServices.map((service) => (
              <div
                key={service.id}
                className="flex items-start justify-between gap-2 p-2 rounded-lg bg-background hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-tight truncate">
                    {service.title}
                  </p>
                  {service.price && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {service.price}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(service.id)}
                  className="shrink-0 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {totalEstimate > 0 && (
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Estimation totale
              </span>
              <span className="font-bold text-lg text-primary">
                ${totalEstimate.toFixed(0)}
              </span>
            </div>
            <p className="text-muted-foreground text-xs mt-1">
              Prix indicatif, peut varier selon votre situation
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
