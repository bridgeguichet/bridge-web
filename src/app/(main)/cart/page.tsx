"use client";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/features/auth/store";
import { useCartStore } from "@/features/cart/store";
import { useServices } from "@/features/marketplace/hooks";
import type { ServiceWithDetails } from "@/features/marketplace/types";
import { cn } from "@/lib/utils";

const PREVIEW_COLORS: Record<string, string> = {
  car: "from-violet-500 to-violet-600",
  home: "from-rose-500 to-rose-600",
  users: "from-emerald-500 to-emerald-600",
  briefcase: "from-amber-500 to-amber-600",
  bell: "from-sky-500 to-sky-600",
};

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, clearCart, updateQuantity } = useCartStore();
  const { data: services, isLoading } = useServices();
  const { isAuthenticated } = useAuthStore();

  const cartServices = items.map((item) => ({
    ...item,
    service: services?.find((s: ServiceWithDetails) => s.id === item.serviceId),
  }));

  const subtotal = cartServices.reduce((sum, item) => {
    const price = parseFloat(item.service?.basePrice || "0");
    return sum + price * item.quantity;
  }, 0);

  const serviceFee = subtotal * 0.05; // 5% frais de service
  const total = subtotal + serviceFee;

  // Vue pour utilisateur non authentifié
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-6xl px-6 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" className="gap-2 mb-6" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-black">Votre panier</h1>
                <p className="text-muted-foreground">Connectez-vous pour finaliser votre commande</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {cartServices.map((item, index) => {
                const icon = item.service?.category?.icon || "briefcase";
                const previewGradient = PREVIEW_COLORS[icon] ?? "from-gray-400 to-gray-500";

                return (
                  <motion.div
                    key={`${item.serviceId}-${item.variantId}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-stretch">
                          {/* Image placeholder */}
                          <div className={cn("w-32 shrink-0 bg-linear-to-br flex items-center justify-center", previewGradient)}>
                            <Package className="w-8 h-8 text-white/60" />
                          </div>

                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                              <div>
                                <Badge variant="secondary" className="mb-2 text-xs">
                                  {item.service?.category?.nameFr || "Service"}
                                </Badge>
                                <h3 className="font-semibold text-lg">{item.service?.nameFr}</h3>
                                <p className="text-sm text-muted-foreground">{item.service?.priceUnit}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => removeItem(item.serviceId, item.variantId)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-3 bg-muted rounded-lg px-3 py-1.5">
                                <button
                                  onClick={() => updateQuantity(item.serviceId, Math.max(1, item.quantity - 1), item.variantId)}
                                  className="w-6 h-6 rounded-full bg-background hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-medium w-6 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.serviceId, item.quantity + 1, item.variantId)}
                                  className="w-6 h-6 rounded-full bg-background hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="font-bold text-lg">
                                {(parseFloat(item.service?.basePrice || "0") * item.quantity).toFixed(2)} USD
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}

              {items.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Votre panier est vide</h3>
                  <p className="text-muted-foreground mb-6">Découvrez nos services et ajoutez-les à votre panier</p>
                  <Button onClick={() => router.push("/")}>
                    Explorer les services
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Right - Auth required */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-24 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Connexion requise</h3>
                      <p className="text-sm text-muted-foreground">Pour passer commande</p>
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span className="font-medium">{subtotal.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frais de service (5%)</span>
                      <span className="font-medium">{serviceFee.toFixed(2)} USD</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-black text-xl">{total.toFixed(2)} USD</span>
                    </div>
                  </div>

                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={() => router.push("/auth/login")}
                  >
                    <User className="w-4 h-4" />
                    Se connecter pour payer
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    En passant commande, vous acceptez nos conditions de service
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Vue pour utilisateur authentifié
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" className="gap-2 mb-6" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Votre panier</h1>
              <p className="text-muted-foreground">{items.length} service{items.length > 1 ? "s" : ""} sélectionné{items.length > 1 ? "s" : ""}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-8">
                  <div className="h-24 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ) : (
              cartServices.map((item, index) => {
                const icon = item.service?.category?.icon || "briefcase";
                const previewGradient = PREVIEW_COLORS[icon] ?? "from-gray-400 to-gray-500";

                return (
                  <motion.div
                    key={`${item.serviceId}-${item.variantId}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex items-stretch">
                          {/* Image placeholder */}
                          <div className={cn("w-32 shrink-0 bg-linear-to-br flex items-center justify-center", previewGradient)}>
                            <Package className="w-8 h-8 text-white/60" />
                          </div>

                          <div className="flex-1 p-5 flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                              <div>
                                <Badge variant="secondary" className="mb-2 text-xs">
                                  {item.service?.category?.nameFr || "Service"}
                                </Badge>
                                <h3 className="font-semibold text-lg">{item.service?.nameFr}</h3>
                                <p className="text-sm text-muted-foreground">Par unité • {item.service?.priceUnit}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeItem(item.serviceId, item.variantId)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-3 bg-muted rounded-lg px-3 py-1.5">
                                <button
                                  onClick={() => updateQuantity(item.serviceId, Math.max(1, item.quantity - 1), item.variantId)}
                                  className="w-7 h-7 rounded-full bg-background hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-medium w-6 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.serviceId, item.quantity + 1, item.variantId)}
                                  className="w-7 h-7 rounded-full bg-background hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="font-bold text-xl">
                                {(parseFloat(item.service?.basePrice || "0") * item.quantity).toFixed(2)} USD
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}

            {items.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Votre panier est vide</h3>
                <p className="text-muted-foreground mb-6">Découvrez nos services et ajoutez-les à votre panier</p>
                <Button onClick={() => router.push("/")}>
                  Explorer les services
                </Button>
              </motion.div>
            )}
          </div>

          {/* Right - Summary & Checkout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-6">Récapitulatif</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-medium">{subtotal.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frais de service (5%)</span>
                    <span className="font-medium">{serviceFee.toFixed(2)} USD</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="font-black text-2xl">{total.toFixed(2)} USD</span>
                  </div>
                </div>

                <Button
                  className="w-full gap-2 mb-3"
                  size="lg"
                  disabled={items.length === 0}
                  onClick={() => router.push("/checkout")}
                >
                  Passer commande
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCart}
                  disabled={items.length === 0}
                >
                  Vider le panier
                </Button>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground text-center">
                    <span className="font-medium">Garantie satisfaction</span> • Annulation gratuite sous 24h
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
