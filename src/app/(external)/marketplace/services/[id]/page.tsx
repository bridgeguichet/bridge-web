"use client";

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Briefcase,
  Car,
  Check,
  Clock,
  Heart,
  Home,
  MessageCircle,
  Shield,
  ShoppingCart,
  Star,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCartStore } from "@/features/cart/store";
import { ServiceCard } from "@/features/marketplace/components/service-card";
import { useService, useServices } from "@/features/marketplace/hooks";
import type { ServiceWithDetails } from "@/features/marketplace/types";
import type { ServiceVariant } from "@/lib/db/schema/services";
import { cn } from "@/lib/utils";

const PREVIEW_COLORS: Record<string, string> = {
  car: "from-violet-500 to-violet-700",
  home: "from-rose-500 to-rose-700",
  users: "from-emerald-500 to-emerald-700",
  briefcase: "from-amber-500 to-amber-700",
  bell: "from-sky-500 to-sky-700",
};

const PREVIEW_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  car: Car,
  home: Home,
  users: Users,
  briefcase: Briefcase,
  bell: Bell,
};

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-rose-400",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-sky-500",
];

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const { data: service, isLoading } = useService(serviceId);
  const { data: allServices } = useServices();
  const addItem = useCartStore((state) => state.addItem);

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />
            </div>
            <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Service non trouvé</p>
          <Button onClick={() => router.push("/")}>
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    );
  }

  const icon = service.category?.icon || "briefcase";
  const previewGradient = PREVIEW_COLORS[icon] ?? "from-gray-400 to-gray-600";
  const IconComponent = PREVIEW_ICONS[icon] ?? Briefcase;
  const initials = service.nameFr.slice(0, 2).toUpperCase();
  const avatarColor =
    AVATAR_COLORS[service.id.charCodeAt(0) % AVATAR_COLORS.length];

  const variants = service.variants;
  const selectedVariantData = variants?.find(
    (v: ServiceVariant) => v.id === selectedVariant,
  );
  const displayPrice = selectedVariantData?.priceModifier || service.basePrice;

  const similarServices = allServices
    ?.filter(
      (s: ServiceWithDetails) =>
        s.id !== service.id && s.categoryId === service.categoryId,
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      serviceId: service.id,
      variantId: selectedVariant || undefined,
      quantity: 1,
    });
    toast.success("Service ajouté au panier");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 bg-transparent hover:text-primary hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-96 rounded-2xl overflow-hidden"
            >
              <div
                className={cn(
                  "absolute inset-0 bg-linear-to-br",
                  previewGradient,
                )}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <IconComponent className="w-32 h-32 text-white/30" />
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-3 mb-3">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-gray-900"
                  >
                    {service.category?.nameFr}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-gray-900 flex items-center gap-1"
                  >
                    <Video className="w-3 h-3" />
                    Consultation vidéo
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                  {service.nameFr}
                </h1>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="ml-1 text-sm">(4.8)</span>
                  </div>
                  <span className="text-sm">128 avis</span>
                </div>
              </div>
            </motion.div>

            {/* Provider info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center",
                      avatarColor,
                    )}
                  >
                    <span className="text-white font-bold text-xl">
                      {initials}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Prestataire Bridge</h3>
                    <p className="text-gray-500 text-sm">
                      Expert certifié en services
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                      >
                        <Shield className="w-3 h-3" />
                        Vérifié
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Réponse rapide
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Contacter
                </Button>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm"
            >
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start rounded-t-xl rounded-b-none border-b bg-transparent p-0 h-auto">
                  <TabsTrigger
                    value="description"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="variants"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6"
                  >
                    Options & Tarifs
                  </TabsTrigger>
                  <TabsTrigger
                    value="specs"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6"
                  >
                    Spécifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6"
                  >
                    Avis (128)
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="p-6 mt-0">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {service.descriptionFr}
                    </p>

                    <h4 className="font-bold text-lg mt-6 mb-3">
                      Ce qui est inclus
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-gray-700">
                          Service professionnel de haute qualité
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-gray-700">
                          Consultation vidéo gratuite avant le service
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-gray-700">
                          Support client 24/7
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-gray-700">
                          Garantie satisfaction ou remboursement
                        </span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="variants" className="p-6 mt-0">
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg">
                      Choisissez votre option
                    </h4>
                    {variants && variants.length > 0 ? (
                      variants.map((variant: ServiceVariant) => {
                        const metadata = variant.metadata as Record<
                          string,
                          unknown
                        > | null;
                        return (
                          <div
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant.id)}
                            className={cn(
                              "border rounded-xl p-4 cursor-pointer transition-all",
                              selectedVariant === variant.id
                                ? "border-primary bg-primary/5"
                                : "hover:border-gray-300",
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                    selectedVariant === variant.id
                                      ? "border-primary"
                                      : "border-gray-300",
                                  )}
                                >
                                  {selectedVariant === variant.id && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold">
                                    {variant.nameFr}
                                  </p>
                                  {/* Metadata badges */}
                                  {metadata && (
                                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                                      {Boolean(metadata.capacity) && (
                                        <span className="flex items-center gap-1">
                                          <Users className="w-3 h-3" />
                                          {`${metadata.capacity}`} places
                                        </span>
                                      )}
                                      {Boolean(metadata.luggage) && (
                                        <span className="flex items-center gap-1">
                                          <Briefcase className="w-3 h-3" />
                                          {`${metadata.luggage}`} bagages
                                        </span>
                                      )}
                                      {Boolean(metadata.bedrooms) && (
                                        <span className="flex items-center gap-1">
                                          <Home className="w-3 h-3" />
                                          {`${metadata.bedrooms}`} ch.
                                        </span>
                                      )}
                                      {Boolean(metadata.bathrooms) && (
                                        <span className="flex items-center gap-1">
                                          <span className="w-3 h-3 flex items-center justify-center">
                                            🚿
                                          </span>
                                          {`${metadata.bathrooms}`} sdb.
                                        </span>
                                      )}
                                      {Boolean(metadata.area) && (
                                        <span className="flex items-center gap-1">
                                          <span className="w-3 h-3 flex items-center justify-center">
                                            📐
                                          </span>
                                          {`${metadata.area}`} m²
                                        </span>
                                      )}
                                      {Boolean(metadata.location) && (
                                        <span className="flex items-center gap-1">
                                          <span className="w-3 h-3 flex items-center justify-center">
                                            📍
                                          </span>
                                          {`${metadata.location}`}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="font-bold text-lg">
                                ${variant.priceModifier}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">
                        Aucune option disponible pour ce service.
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="specs" className="p-6 mt-0">
                  {(() => {
                    const variantData = variants?.find(
                      (v: ServiceVariant) => v.id === selectedVariant,
                    );
                    const metadata = (variantData?.metadata ||
                      service.metadata) as Record<string, unknown> | null;
                    if (!metadata) {
                      return (
                        <p className="text-gray-500">
                          Aucune spécification disponible.
                        </p>
                      );
                    }

                    const hasAmenities =
                      Boolean(metadata.amenities) &&
                      Array.isArray(metadata.amenities) &&
                      metadata.amenities.length > 0;
                    const hasFeatures =
                      Boolean(metadata.features) &&
                      Array.isArray(metadata.features) &&
                      metadata.features.length > 0;
                    const hasSpecs =
                      Boolean(metadata.capacity) ||
                      Boolean(metadata.bedrooms) ||
                      Boolean(metadata.bathrooms) ||
                      Boolean(metadata.area) ||
                      Boolean(metadata.landArea) ||
                      Boolean(metadata.floor) ||
                      Boolean(metadata.location) ||
                      Boolean(metadata.address) ||
                      Boolean(metadata.luggage);
                    if (!hasAmenities && !hasFeatures && !hasSpecs) {
                      return (
                        <p className="text-gray-500">
                          Aucune spécification disponible.
                        </p>
                      );
                    }

                    return (
                      <div className="space-y-6">
                        {/* Équipements */}
                        {hasAmenities && (
                          <div>
                            <h4 className="font-bold text-lg mb-3">
                              Équipements
                            </h4>
                            <ul className="grid grid-cols-2 gap-2">
                              {(metadata.amenities as string[]).map(
                                (amenity: string, index: number) => (
                                  <li
                                    key={index}
                                    className="flex items-center gap-2 text-sm text-gray-700"
                                  >
                                    <Check className="w-4 h-4 text-emerald-500" />
                                    {amenity}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Caractéristiques */}
                        {hasFeatures && (
                          <div>
                            <h4 className="font-bold text-lg mb-3">
                              Caractéristiques
                            </h4>
                            <ul className="grid grid-cols-2 gap-2">
                              {(metadata.features as string[]).map(
                                (feature: string, index: number) => (
                                  <li
                                    key={index}
                                    className="flex items-center gap-2 text-sm text-gray-700"
                                  >
                                    <Check className="w-4 h-4 text-emerald-500" />
                                    {feature}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Spécifications techniques */}
                        {hasSpecs && (
                          <div>
                            <h4 className="font-bold text-lg mb-3">
                              Spécifications
                            </h4>
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                              {Boolean(metadata.capacity) && (
                                <>
                                  <dt className="text-gray-500">Capacité</dt>
                                  <dd className="font-medium">
                                    {`${metadata.capacity}`} personnes
                                  </dd>
                                </>
                              )}
                              {Boolean(metadata.bedrooms) && (
                                <>
                                  <dt className="text-gray-500">Chambres</dt>
                                  <dd className="font-medium">{`${metadata.bedrooms}`}</dd>
                                </>
                              )}
                              {Boolean(metadata.bathrooms) && (
                                <>
                                  <dt className="text-gray-500">
                                    Salles de bain
                                  </dt>
                                  <dd className="font-medium">{`${metadata.bathrooms}`}</dd>
                                </>
                              )}
                              {Boolean(metadata.area) && (
                                <>
                                  <dt className="text-gray-500">Surface</dt>
                                  <dd className="font-medium">
                                    {`${metadata.area}`} m²
                                  </dd>
                                </>
                              )}
                              {Boolean(metadata.landArea) && (
                                <>
                                  <dt className="text-gray-500">Terrain</dt>
                                  <dd className="font-medium">
                                    {`${metadata.landArea}`} m²
                                  </dd>
                                </>
                              )}
                              {Boolean(metadata.floor) && (
                                <>
                                  <dt className="text-gray-500">Étage</dt>
                                  <dd className="font-medium">{`${metadata.floor}`}</dd>
                                </>
                              )}
                              {Boolean(metadata.location) && (
                                <>
                                  <dt className="text-gray-500">
                                    Localisation
                                  </dt>
                                  <dd className="font-medium">{`${metadata.location}`}</dd>
                                </>
                              )}
                              {Boolean(metadata.address) && (
                                <>
                                  <dt className="text-gray-500">Adresse</dt>
                                  <dd className="font-medium">{`${metadata.address}`}</dd>
                                </>
                              )}
                              {Boolean(metadata.luggage) && (
                                <>
                                  <dt className="text-gray-500">Bagages</dt>
                                  <dd className="font-medium">
                                    {`${metadata.luggage}`} bagages
                                  </dd>
                                </>
                              )}
                            </dl>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </TabsContent>

                <TabsContent value="reviews" className="p-6 mt-0">
                  <div className="space-y-6">
                    {/* Rating summary */}
                    <div className="flex items-center gap-8 p-4 bg-gray-50 rounded-xl">
                      <div className="text-center">
                        <div className="text-4xl font-black">4.8</div>
                        <div className="flex items-center gap-0.5 justify-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">128 avis</p>
                      </div>
                      <Separator orientation="vertical" className="h-16" />
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-sm w-4">{star}</span>
                            <Star className="w-4 h-4 text-gray-300" />
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400 rounded-full"
                                style={{
                                  width: `${star === 5 ? 75 : star === 4 ? 15 : 10}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-gray-500 w-8">
                              {star === 5
                                ? 96
                                : star === 4
                                  ? 19
                                  : star === 3
                                    ? 8
                                    : star === 2
                                      ? 4
                                      : 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reviews list */}
                    <div className="space-y-4">
                      {[
                        {
                          name: "Marie K.",
                          rating: 5,
                          date: "Il y a 2 jours",
                          comment:
                            "Excellent service ! Je recommande vivement.",
                        },
                        {
                          name: "Jean P.",
                          rating: 5,
                          date: "Il y a 1 semaine",
                          comment: "Très professionnel et rapide.",
                        },
                        {
                          name: "Sophie M.",
                          rating: 4,
                          date: "Il y a 2 semaines",
                          comment:
                            "Bon service, légèrement cher mais qualité au rendez-vous.",
                        },
                      ].map((review, i) => (
                        <div
                          key={i}
                          className="border-b last:border-0 pb-4 last:pb-0"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="font-bold text-gray-600">
                                  {review.name[0]}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold">{review.name}</p>
                                <p className="text-sm text-gray-500">
                                  {review.date}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[...Array(review.rating)].map((_, j) => (
                                <Star
                                  key={j}
                                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Right column - Pricing card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm sticky top-24"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">À partir de</p>
                  <p className="text-3xl font-black">${displayPrice}</p>
                  <p className="text-sm text-gray-500">/{service.priceUnit}</p>
                </div>
                <button
                  onClick={() => setLiked(!liked)}
                  className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Favori"
                >
                  <Heart
                    className={cn(
                      "w-5 h-5",
                      liked ? "fill-rose-500 text-rose-500" : "text-gray-400",
                    )}
                  />
                </button>
              </div>

              <Separator className="my-4" />

              {/* Quick features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Livraison en 24-48h</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>Garantie 30 jours</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                  <span>Support inclus</span>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full mb-3 gap-2"
                size="lg"
              >
                <ShoppingCart className="w-4 h-4" />
                Ajouter au panier
              </Button>

              <Button variant="outline" className="w-full" size="lg">
                Réserver maintenant
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                Aucun frais de réservation. Annulation gratuite 24h avant.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Similar services */}
        {similarServices && similarServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6">Services similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similarServices.map((s: ServiceWithDetails, i: number) => (
                <ServiceCard key={s.id} service={s} badgeIndex={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
