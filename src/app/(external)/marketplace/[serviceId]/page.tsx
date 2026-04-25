"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";
import {
  ServiceDetailHeader,
  ServiceGallery,
  ServiceInfo,
  ServiceTabs,
  VariantSelector,
  VendorCard,
} from "@/features/marketplace/components";
import { useService } from "@/features/marketplace/hooks";
import type { ServiceVariant } from "@/lib/db/schema";
import { useTranslation } from "@/lib/i18n/use-translation";
import { toast } from "sonner";

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.serviceId as string;
  const { t, language } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);

  const { data: service, isLoading } = useService(serviceId);
  const [selectedVariant, setSelectedVariant] = useState<ServiceVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!service) return;

    if (service.variants && service.variants.length > 0 && !selectedVariant) {
      toast.error(t("marketplace.selectVariant") || "Veuillez sélectionner une variante");
      return;
    }

    addItem({
      serviceId: service.id,
      variantId: selectedVariant?.id,
      quantity,
      metadata: {
        serviceName: language === "fr" ? service.nameFr : service.nameEn,
        variantName: selectedVariant ? (language === "fr" ? selectedVariant.nameFr : selectedVariant.nameEn) : null,
        unitPrice: selectedVariant ? selectedVariant.priceModifier : service.basePrice,
      },
    });

    toast.success(
      `${selectedVariant ? (language === "fr" ? selectedVariant.nameFr : selectedVariant.nameEn) : language === "fr" ? service.nameFr : service.nameEn} ${t("marketplace.addedToCart") || "ajouté au panier"}`,
    );
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">{t("marketplace.serviceNotFound") || "Service non trouvé"}</h1>
      </div>
    );
  }

  const serviceName = language === "fr" ? service.nameFr : service.nameEn;
  const serviceDescription = language === "fr" ? service.descriptionFr : service.descriptionEn;
  const categoryName = service.category ? (language === "fr" ? service.category.nameFr : service.category.nameEn) : "";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ServiceDetailHeader serviceName={serviceName} categoryName={categoryName} />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Colonne gauche: Galerie + Info */}
          <div className="lg:col-span-2 space-y-6">
            <ServiceGallery serviceId={service.id} serviceName={serviceName} />

            <ServiceInfo
              serviceName={serviceName}
              description={serviceDescription}
              basePrice={service.basePrice}
              priceUnit={service.priceUnit}
              hasVariants={!!service.variants && service.variants.length > 0}
            />

            {/* Sélection variante si disponible */}
            {service.variants && service.variants.length > 0 && (
              <VariantSelector
                variants={service.variants}
                selectedVariant={selectedVariant}
                onSelectVariant={setSelectedVariant}
                language={language}
              />
            )}

            {/* Quantité et ajout panier */}
            <div className="flex items-center gap-4 rounded-lg border bg-card p-6">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                  +
                </Button>
              </div>

              <Button onClick={handleAddToCart} size="lg" className="flex-1">
                {t("marketplace.addToCart") || "Ajouter au panier"}
              </Button>
            </div>

            {/* Tabs description/caractéristiques */}
            <ServiceTabs
              description={serviceDescription}
              metadata={service.metadata}
              selectedVariant={selectedVariant}
            />
          </div>

          {/* Colonne droite: Infos prestataire */}
          <div className="lg:col-span-1">
            {service.vendor && <VendorCard vendor={service.vendor} />}
          </div>
        </div>
      </div>
    </div>
  );
}
