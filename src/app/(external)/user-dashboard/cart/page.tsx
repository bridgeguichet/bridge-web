"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Briefcase,
  Car,
  Home,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/external-components/user-dashboard/empty-state";
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

const PREVIEW_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  car: Car,
  home: Home,
  users: Users,
  briefcase: Briefcase,
  bell: Bell,
};

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { data: services, isLoading } = useServices();

  const cartServices = items.map((item) => ({
    ...item,
    service: services?.find((s: ServiceWithDetails) => s.id === item.serviceId),
  }));

  const subtotal = cartServices.reduce((sum, item) => {
    const price = parseFloat(item.service?.basePrice || "0");
    return sum + price * item.quantity;
  }, 0);
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Mon panier</h1>
              <p className="text-muted-foreground">Gérez vos services avant de passer commande</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EmptyState
            icon={ShoppingBag}
            title="Votre panier est vide"
            description="Explorez nos services et ajoutez-les à votre panier pour commencer."
            action={{
              label: "Explorer les services",
              href: "/marketplace#services",
            }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Mon panier</h1>
            <p className="text-muted-foreground">
              {items.length} service{items.length > 1 ? "s" : ""} sélectionné{items.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button variant="ghost" onClick={clearCart} className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="mr-2 h-4 w-4" />
          Vider le panier
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cart items */}
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
              const IconComponent = PREVIEW_ICONS[icon] ?? Briefcase;

              return (
                <motion.div
                  key={item.serviceId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden group hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex items-stretch">
                        {/* Image zone */}
                        <div className={cn("w-32 shrink-0 bg-linear-to-br flex items-center justify-center", previewGradient)}>
                          <IconComponent className="w-10 h-10 text-white/70" />
                        </div>

                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge variant="secondary" className="mb-2 text-xs">
                                {item.service?.category?.nameFr || "Service"}
                              </Badge>
                              <h3 className="font-semibold text-lg text-gray-900">{item.service?.nameFr}</h3>
                              <p className="text-sm text-muted-foreground">Par unité • {item.service?.priceUnit}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.serviceId, item.variantId)}
                              className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2 rounded-lg border bg-background">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-muted"
                                onClick={() => updateQuantity(item.serviceId, Math.max(1, item.quantity - 1), item.variantId)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-muted"
                                onClick={() => updateQuantity(item.serviceId, item.quantity + 1, item.variantId)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <span className="text-xl font-black text-primary">
                              ${(parseFloat(item.service?.basePrice || "0") * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold">Récapitulatif</h2>

              <div className="mt-6 space-y-3">
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
                  <span className="text-2xl font-black">{total.toFixed(2)} USD</span>
                </div>
              </div>

              <Button
                className="mt-6 w-full gap-2"
                size="lg"
                disabled={items.length === 0}
              >
                Passer commande
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button variant="outline" className="mt-3 w-full" asChild>
                <Link href="/marketplace">Continuer mes achats</Link>
              </Button>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  <span className="font-medium">Garantie satisfaction</span> • Annulation gratuite sous 24h
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
