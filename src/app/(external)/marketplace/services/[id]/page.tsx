"use client";

import { useState } from "react";

import { CartSheet } from "@/features/cart/components/cart-sheet";

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
import { CartSheet } from "@/features/cart/components/cart-sheet";
import { useAuthRedirect, useSession } from "@/features/auth/hooks";
import { useCartStore } from "@/features/cart/store";
import { ServiceCard } from "@/features/marketplace/components/service-card";
import { useFavoritesStore } from "@/features/marketplace/store";
import { useService, useServices } from "@/features/marketplace/hooks";
import { useFavoritesStore } from "@/features/marketplace/store";
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

const PREVIEW_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  car: Car,
  home: Home,
  users: Users,
  briefcase: Briefcase,
  bell: Bell,
};

const AVATAR_COLORS = ["bg-violet-500", "bg-rose-400", "bg-emerald-500", "bg-amber-500", "bg-sky-500"];

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const { data: service, isLoading } = useService(serviceId);
  const { data: allServices } = useServices();
  const addItem = useCartStore((state) => state.addItem);

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { isAuthenticated } = useSession();
  const { redirectToLogin } = useAuthRedirect();
  const toggle = useFavoritesStore((state) => state.toggle);
  const liked = useFavoritesStore((state) => state.isLiked(serviceId));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8 h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />
              <div className="h-48 animate-pulse rounded-xl bg-gray-200" />
            </div>
            <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">Service non trouvé</p>
          <Button onClick={() => router.push("/")}>Retour à l&apos;accueil</Button>
        </div>
      </div>
    );
  }

  const icon = service.category?.icon || "briefcase";
  const previewGradient = PREVIEW_COLORS[icon] ?? "from-gray-400 to-gray-600";
  const IconComponent = PREVIEW_ICONS[icon] ?? Briefcase;
  const initials = service.nameFr.slice(0, 2).toUpperCase();
  const avatarColor = AVATAR_COLORS[service.id.charCodeAt(0) % AVATAR_COLORS.length];

  const variants = service.variants;
  const selectedVariantData = variants?.find((v: ServiceVariant) => v.id === selectedVariant);
  const displayPrice = selectedVariantData?.priceModifier || service.basePrice;

  const similarServices = allServices
    ?.filter((s: ServiceWithDetails) => s.id !== service.id && s.categoryId === service.categoryId)
    .slice(0, 4);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      redirectToLogin(`/marketplace/services/${serviceId}`);
      return;
    }
    toggle(serviceId);
  };

  const handleAddToCart = () => {
    addItem({
      serviceId: service.id,
      variantId: selectedVariant || undefined,
      quantity: 1,
    });
    toast.success("Service ajouté au panier");
  };

  const handleReserveNow = () => {
    addItem({
      serviceId: service.id,
      variantId: selectedVariant || undefined,
      quantity: 1,
    });
    toast.success("Service ajouté au panier");

    if (isAuthenticated) {
      router.push("/checkout");
    } else {
      redirectToLogin("/checkout");
    }
  };

  return (
    <>
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
      <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white sticky top-0 z-50 border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 bg-transparent hover:text-primary hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>

          {/* Bouton Panier */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-full hover:bg-gray-100"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xs">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column - Main content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-96 overflow-hidden rounded-2xl"
            >
              <div className={cn("absolute inset-0 bg-linear-to-br", previewGradient)}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <IconComponent className="h-32 w-32 text-white/30" />
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-8">
                <div className="mb-3 flex items-center gap-3">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    {service.category?.nameFr}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1 bg-white/90 text-gray-900">
                    <Video className="h-3 w-3" />
                    Consultation vidéo
                  </Badge>
                </div>
                <h1 className="mb-2 font-black text-3xl text-white md:text-4xl">{service.nameFr}</h1>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
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
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("flex h-16 w-16 items-center justify-center rounded-full", avatarColor)}>
                    <span className="font-bold text-white text-xl">{initials}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Prestataire Bridge</h3>
                    <p className="text-gray-500 text-sm">Expert certifié en services</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <Shield className="h-3 w-3" />
                        Vérifié
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="mr-1 inline h-3 w-3" />
                        Réponse rapide
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Contacter
                </Button>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl bg-white shadow-sm"
            >
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="h-auto w-full justify-start rounded-t-xl rounded-b-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="description"
                    className="rounded-none border-transparent border-b-2 px-6 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="variants"
                    className="rounded-none border-transparent border-b-2 px-6 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Options & Tarifs
                  </TabsTrigger>
                  <TabsTrigger
                    value="specs"
                    className="rounded-none border-transparent border-b-2 px-6 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Spécifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-none border-transparent border-b-2 px-6 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Avis (128)
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-0 p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{service.descriptionFr}</p>

                    <h4 className="mt-6 mb-3 font-bold text-lg">Ce qui est inclus</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                        <span className="text-gray-700">Service professionnel de haute qualité</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                        <span className="text-gray-700">Consultation vidéo gratuite avant le service</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                        <span className="text-gray-700">Support client 24/7</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                        <span className="text-gray-700">Garantie satisfaction ou remboursement</span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="variants" className="mt-0 p-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg">Choisissez votre option</h4>
                    {variants && variants.length > 0 ? (
                      variants.map((variant: ServiceVariant) => {
                        const metadata = variant.metadata as Record<string, unknown> | null;
                        return (
                          <div
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant.id)}
                            className={cn(
                              "cursor-pointer rounded-xl border p-4 transition-all",
                              selectedVariant === variant.id ? "border-primary bg-primary/5" : "hover:border-gray-300",
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full border-2",
                                    selectedVariant === variant.id ? "border-primary" : "border-gray-300",
                                  )}
                                >
                                  {selectedVariant === variant.id && (
                                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold">{variant.nameFr}</p>
                                  {/* Metadata badges */}
                                  {metadata && (
                                    <div className="mt-2 flex flex-wrap gap-2 text-muted-foreground text-xs">
                                      {Boolean(metadata.capacity) && (
                                        <span className="flex items-center gap-1">
                                          <Users className="h-3 w-3" />
                                          {`${metadata.capacity}`} places
                                        </span>
                                      )}
                                      {Boolean(metadata.luggage) && (
                                        <span className="flex items-center gap-1">
                                          <Briefcase className="h-3 w-3" />
                                          {`${metadata.luggage}`} bagages
                                        </span>
                                      )}
                                      {Boolean(metadata.bedrooms) && (
                                        <span className="flex items-center gap-1">
                                          <Home className="h-3 w-3" />
                                          {`${metadata.bedrooms}`} ch.
                                        </span>
                                      )}
                                      {Boolean(metadata.bathrooms) && (
                                        <span className="flex items-center gap-1">
                                          <span className="flex h-3 w-3 items-center justify-center">🚿</span>
                                          {`${metadata.bathrooms}`} sdb.
                                        </span>
                                      )}
                                      {Boolean(metadata.area) && (
                                        <span className="flex items-center gap-1">
                                          <span className="flex h-3 w-3 items-center justify-center">📐</span>
                                          {`${metadata.area}`} m²
                                        </span>
                                      )}
                                      {Boolean(metadata.location) && (
                                        <span className="flex items-center gap-1">
                                          <span className="flex h-3 w-3 items-center justify-center">📍</span>
                                          {`${metadata.location}`}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="font-bold text-lg">${variant.priceModifier}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">Aucune option disponible pour ce service.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="specs" className="mt-0 p-6">
                  {(() => {
                    const variantData = variants?.find((v: ServiceVariant) => v.id === selectedVariant);
                    const metadata = (variantData?.metadata || service.metadata) as Record<string, unknown> | null;
                    if (!metadata) {
                      return <p className="text-gray-500">Aucune spécification disponible.</p>;
                    }

                    const hasAmenities =
                      Boolean(metadata.amenities) && Array.isArray(metadata.amenities) && metadata.amenities.length > 0;
                    const hasFeatures =
                      Boolean(metadata.features) && Array.isArray(metadata.features) && metadata.features.length > 0;
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
                      return <p className="text-gray-500">Aucune spécification disponible.</p>;
                    }

                    return (
                      <div className="space-y-6">
                        {/* Équipements */}
                        {hasAmenities && (
                          <div>
                            <h4 className="mb-3 font-bold text-lg">Équipements</h4>
                            <ul className="grid grid-cols-2 gap-2">
                              {(metadata.amenities as string[]).map((amenity: string, index: number) => (
                                <li key={index} className="flex items-center gap-2 text-gray-700 text-sm">
                                  <Check className="h-4 w-4 text-emerald-500" />
                                  {amenity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Caractéristiques */}
                        {hasFeatures && (
                          <div>
                            <h4 className="mb-3 font-bold text-lg">Caractéristiques</h4>
                            <ul className="grid grid-cols-2 gap-2">
                              {(metadata.features as string[]).map((feature: string, index: number) => (
                                <li key={index} className="flex items-center gap-2 text-gray-700 text-sm">
                                  <Check className="h-4 w-4 text-emerald-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Spécifications techniques */}
                        {hasSpecs && (
                          <div>
                            <h4 className="mb-3 font-bold text-lg">Spécifications</h4>
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                              {Boolean(metadata.capacity) && (
                                <>
                                  <dt className="text-gray-500">Capacité</dt>
                                  <dd className="font-medium">{`${metadata.capacity}`} personnes</dd>
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
                                  <dt className="text-gray-500">Salles de bain</dt>
                                  <dd className="font-medium">{`${metadata.bathrooms}`}</dd>
                                </>
                              )}
                              {Boolean(metadata.area) && (
                                <>
                                  <dt className="text-gray-500">Surface</dt>
                                  <dd className="font-medium">{`${metadata.area}`} m²</dd>
                                </>
                              )}
                              {Boolean(metadata.landArea) && (
                                <>
                                  <dt className="text-gray-500">Terrain</dt>
                                  <dd className="font-medium">{`${metadata.landArea}`} m²</dd>
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
                                  <dt className="text-gray-500">Localisation</dt>
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
                                  <dd className="font-medium">{`${metadata.luggage}`} bagages</dd>
                                </>
                              )}
                            </dl>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </TabsContent>

                <TabsContent value="reviews" className="mt-0 p-6">
                  <div className="space-y-6">
                    {/* Rating summary */}
                    <div className="flex items-center gap-8 rounded-xl bg-gray-50 p-4">
                      <div className="text-center">
                        <div className="font-black text-4xl">4.8</div>
                        <div className="flex items-center justify-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="mt-1 text-gray-500 text-sm">128 avis</p>
                      </div>
                      <Separator orientation="vertical" className="h-16" />
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center gap-3">
                            <span className="w-4 text-sm">{star}</span>
                            <Star className="h-4 w-4 text-gray-300" />
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full bg-yellow-400"
                                style={{
                                  width: `${star === 5 ? 75 : star === 4 ? 15 : 10}%`,
                                }}
                              />
                            </div>
                            <span className="w-8 text-gray-500 text-sm">
                              {star === 5 ? 96 : star === 4 ? 19 : star === 3 ? 8 : star === 2 ? 4 : 1}
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
                          comment: "Excellent service ! Je recommande vivement.",
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
                          comment: "Bon service, légèrement cher mais qualité au rendez-vous.",
                        },
                      ].map((review, i) => (
                        <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="mb-2 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                <span className="font-bold text-gray-600">{review.name[0]}</span>
                              </div>
                              <div>
                                <p className="font-semibold">{review.name}</p>
                                <p className="text-gray-500 text-sm">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[...Array(review.rating)].map((_, j) => (
                                <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
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
              className="sticky top-24 rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="mb-1 text-gray-500 text-sm">À partir de</p>
                  <p className="font-black text-3xl">${displayPrice}</p>
                  <p className="text-gray-500 text-sm">/{service.priceUnit}</p>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 border hover:bg-rose-50"
                  aria-label="Favori"
                >
                  {liked && <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/50" />}
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-colors",
                      liked ? "fill-rose-500 text-rose-500" : "text-gray-400",
                    )}
                  />
                </button>
              </div>

              <Separator className="my-4" />

              {/* Quick features */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Livraison en 24-48h</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span>Garantie 30 jours</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MessageCircle className="h-4 w-4 text-gray-400" />
                  <span>Support inclus</span>
                </div>
              </div>

              <Button onClick={handleAddToCart} className="mb-3 w-full gap-2" size="lg">
                <ShoppingCart className="h-4 w-4" />
                Ajouter au panier
              </Button>

              <Button variant="outline" className="w-full" size="lg" onClick={handleReserveNow}>
                Réserver maintenant
              </Button>

              <p className="mt-4 text-center text-gray-500 text-xs">
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
            <h2 className="mb-6 font-bold text-2xl">Services similaires</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similarServices.map((s: ServiceWithDetails, i: number) => (
                <ServiceCard key={s.id} service={s} badgeIndex={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
    </>
  );
}
