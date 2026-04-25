"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ServiceVariant } from "@/lib/db/schema";

interface ServiceTabsProps {
  description?: string | null;
  metadata?: Record<string, any> | null;
  selectedVariant?: ServiceVariant | null;
}

export function ServiceTabs({ description, metadata, selectedVariant }: ServiceTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const variantMetadata = selectedVariant?.metadata as Record<string, any> | null;
  const displayMetadata = variantMetadata || metadata;

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="features">Caractéristiques</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-4 space-y-4">
          <div className="prose prose-sm max-w-none">
            {description ? (
              <p className="text-muted-foreground">{description}</p>
            ) : (
              <p className="text-muted-foreground italic">Aucune description disponible</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="features" className="mt-4">
          {displayMetadata ? (
            <div className="space-y-4">
              {/* Amenities */}
              {displayMetadata.amenities && Array.isArray(displayMetadata.amenities) && (
                <div>
                  <h4 className="mb-2 font-semibold">Équipements</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {displayMetadata.amenities.map((amenity: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="text-primary">✓</span>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Features */}
              {displayMetadata.features && Array.isArray(displayMetadata.features) && (
                <div>
                  <h4 className="mb-2 font-semibold">Caractéristiques</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {displayMetadata.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="text-primary">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technical specs */}
              <div>
                <h4 className="mb-2 font-semibold">Spécifications</h4>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {displayMetadata.capacity && (
                    <>
                      <dt className="text-muted-foreground">Capacité</dt>
                      <dd className="font-medium">{displayMetadata.capacity} personnes</dd>
                    </>
                  )}
                  {displayMetadata.bedrooms && (
                    <>
                      <dt className="text-muted-foreground">Chambres</dt>
                      <dd className="font-medium">{displayMetadata.bedrooms}</dd>
                    </>
                  )}
                  {displayMetadata.bathrooms && (
                    <>
                      <dt className="text-muted-foreground">Salles de bain</dt>
                      <dd className="font-medium">{displayMetadata.bathrooms}</dd>
                    </>
                  )}
                  {displayMetadata.area && (
                    <>
                      <dt className="text-muted-foreground">Surface</dt>
                      <dd className="font-medium">{displayMetadata.area}</dd>
                    </>
                  )}
                  {displayMetadata.landArea && (
                    <>
                      <dt className="text-muted-foreground">Terrain</dt>
                      <dd className="font-medium">{displayMetadata.landArea}</dd>
                    </>
                  )}
                  {displayMetadata.floor && (
                    <>
                      <dt className="text-muted-foreground">Étage</dt>
                      <dd className="font-medium">{displayMetadata.floor}</dd>
                    </>
                  )}
                  {displayMetadata.location && (
                    <>
                      <dt className="text-muted-foreground">Localisation</dt>
                      <dd className="font-medium">{displayMetadata.location}</dd>
                    </>
                  )}
                  {displayMetadata.address && (
                    <>
                      <dt className="text-muted-foreground">Adresse</dt>
                      <dd className="font-medium">{displayMetadata.address}</dd>
                    </>
                  )}
                </dl>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">Aucune caractéristique disponible</p>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <div className="space-y-4">
            <p className="text-muted-foreground italic">
              Les avis clients seront bientôt disponibles. Cette fonctionnalité est en cours de développement.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
