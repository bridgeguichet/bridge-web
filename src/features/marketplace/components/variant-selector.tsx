"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Tick01Icon } from "@hugeicons/core-free-icons";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ServiceVariant } from "@/lib/db/schema";

interface VariantSelectorProps {
  variants: ServiceVariant[];
  selectedVariant: ServiceVariant | null;
  onSelectVariant: (variant: ServiceVariant) => void;
  language: string;
}

export function VariantSelector({ variants, selectedVariant, onSelectVariant, language }: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Sélectionnez une variante</h3>
      <RadioGroup
        value={selectedVariant?.id}
        onValueChange={(id) => {
          const variant = variants.find((v) => v.id === id);
          if (variant) onSelectVariant(variant);
        }}
      >
        <div className="space-y-3">
          {variants.map((variant) => {
            const isSelected = selectedVariant?.id === variant.id;
            const variantName = language === "fr" ? variant.nameFr : variant.nameEn;
            const metadata = variant.metadata as Record<string, any> | null;

            return (
              <div key={variant.id}>
                <Label
                  htmlFor={variant.id}
                  className={`flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all ${
                    isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={variant.id} id={variant.id} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{variantName}</span>
                      <span className="text-lg font-bold">${variant.priceModifier}</span>
                    </div>

                    {/* Metadata display */}
                    {metadata && (
                      <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
                        {metadata.capacity && (
                          <span className="flex items-center gap-1">
                            👥 {metadata.capacity} {metadata.capacity > 1 ? "places" : "place"}
                          </span>
                        )}
                        {metadata.luggage && (
                          <span className="flex items-center gap-1">🧳 {metadata.luggage} bagages</span>
                        )}
                        {metadata.bedrooms && (
                          <span className="flex items-center gap-1">🛏️ {metadata.bedrooms} ch.</span>
                        )}
                        {metadata.bathrooms && (
                          <span className="flex items-center gap-1">🚿 {metadata.bathrooms} sdb.</span>
                        )}
                        {metadata.area && <span className="flex items-center gap-1">📐 {metadata.area}</span>}
                        {metadata.location && <span className="flex items-center gap-1">📍 {metadata.location}</span>}
                      </div>
                    )}

                    {/* Features */}
                    {metadata?.features && Array.isArray(metadata.features) && metadata.features.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {metadata.features.slice(0, 4).map((feature: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs"
                          >
                            <HugeiconsIcon
                              icon={Tick01Icon}
                              size={16}
                              color="currentColor"
                              className="shrink-0 text-primary"
                            />
                            {feature}
                          </span>
                        ))}
                        {metadata.features.length > 4 && (
                          <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs">
                            +{metadata.features.length - 4} autres
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>
    </Card>
  );
}
