"use client";

import { ArrowRight, Check, Package, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ServicePack } from "../types";

interface PackRecommendationProps {
  pack: ServicePack;
  includedServices: string[];
  onSelect?: (packId: string) => void;
  isSelected?: boolean;
}

export function PackRecommendation({
  pack,
  includedServices,
  onSelect,
  isSelected = false,
}: PackRecommendationProps) {
  const matchPercentage = Math.round(
    (includedServices.length / pack.services.length) * 100,
  );

  return (
    <Card className={cn(
      "border-2 shadow-lg transition-all duration-300",
      isSelected 
        ? "border-green-500 bg-linear-to-br from-green-500/10 to-background" 
        : "border-primary/20 bg-linear-to-br from-primary/5 to-background"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Package className="w-5 h-5" />
          </div>
          <Badge variant="default" className="shrink-0">
            {matchPercentage}% match
          </Badge>
        </div>
        <CardTitle className="text-lg">{pack.name}</CardTitle>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-2xl text-primary">{pack.price}</span>
          {pack.category === "Abonnement" && (
            <span className="text-muted-foreground text-sm">/mois</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-sm leading-relaxed">
          {pack.valueProposition}
        </CardDescription>

        <div className="space-y-2">
          <p className="font-semibold text-sm">Services inclus :</p>
          <ul className="space-y-1.5">
            {pack.services.slice(0, 4).map((serviceId) => {
              const isIncluded = includedServices.includes(serviceId);
              return (
                <li
                  key={serviceId}
                  className={cn(
                    "flex items-start gap-2 text-sm",
                    isIncluded ? "text-primary font-medium" : "text-muted-foreground",
                  )}
                >
                  <Check
                    className={cn(
                      "w-4 h-4 shrink-0 mt-0.5",
                      isIncluded ? "text-primary" : "text-muted-foreground/50",
                    )}
                  />
                  <span className="flex-1 leading-tight">
                    {serviceId.split("-").join(" ")}
                  </span>
                </li>
              );
            })}
            {pack.services.length > 4 && (
              <li className="text-muted-foreground text-xs ml-6">
                +{pack.services.length - 4} autres services
              </li>
            )}
          </ul>
        </div>

        <Button
          onClick={() => onSelect?.(pack.id)}
          className="w-full gap-2"
          size="sm"
          variant={isSelected ? "default" : "default"}
          disabled={isSelected}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4" />
              Pack sélectionné
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Choisir ce pack
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
