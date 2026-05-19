"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Briefcase01Icon,
  Car01Icon,
  Home01Icon,
  Remove01Icon,
  Package01Icon,
  Add01Icon,
  ShoppingCart01Icon,
  Delete01Icon,
  UserGroupIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/user-dashboard/empty-state";
import { useCartStore } from "@/features/cart/store";
import { useServices } from "@/features/marketplace/hooks";

const PREVIEW_ICONS: Record<string, IconSvgElement> = {
  briefcase: Briefcase01Icon,
  car: Car01Icon,
  home: Home01Icon,
  package: Package01Icon,
  users: UserGroupIcon,
};

const PREVIEW_COLORS: Record<string, string> = {
  briefcase: "from-blue-400 to-indigo-500",
  car: "from-emerald-400 to-teal-500",
  home: "from-orange-400 to-amber-500",
  package: "from-purple-400 to-violet-500",
  users: "from-pink-400 to-rose-500",
};

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { data: services, isLoading } = useServices();

  const PREVIEW_COLORS: Record<string, string> = {
    briefcase: "from-blue-400 to-indigo-500",
    car: "from-emerald-400 to-teal-500",
    home: "from-orange-400 to-amber-500",
    package: "from-purple-400 to-violet-500",
    users: "from-pink-400 to-rose-500",
  };

  const cartServices = items.map((item) => ({
    ...item,
    service: services?.find((s) => s.id === item.serviceId),
    variant: services
      ?.find((s) => s.id === item.serviceId)
      ?.variants?.find((v) => v.id === item.variantId),
  }));

  // Calculate totals using variant prices when available
  const subtotal = cartServices.reduce((sum, item) => {
    const price = item.variant
      ? item.variant.priceModifier
      : item.service?.basePrice || "0";
    return sum + parseFloat(price) * item.quantity;
  }, 0);

  const taxes = subtotal * 0.1;
  const total = subtotal + taxes;

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <HugeiconsIcon icon={ShoppingCart01Icon} size={24} color="currentColor" className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Mon panier</h1>
              <p className="text-muted-foreground">
                Gérez vos services avant de passer commande
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EmptyState
            icon={ShoppingCart01Icon}
            title="Votre panier est vide"
            description="Explorez nos services et ajoutez-les à votre panier pour commencer."
            action={{
              label: "Explorer les services",
              href: "/",
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
        <div>
          <h1 className="text-4xl font-black text-gray-900 md:text-5xl">
            Mon panier
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {items.length} article{items.length > 1 ? "s" : ""} dans votre
            panier
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <HugeiconsIcon icon={Delete01Icon} size={16} color="currentColor" className="mr-2" />
          Vider le panier
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cartServices.map((item, index) => {
            const icon = item.service?.category?.icon || "briefcase";
            const previewGradient =
              PREVIEW_COLORS[icon] ?? "from-gray-400 to-gray-500";
            const IconComponent = PREVIEW_ICONS[icon] ?? Briefcase01Icon;  // IconSvgElement
            const displayName = item.variant
              ? `${item.service?.nameFr} - ${item.variant.nameFr}`
              : item.service?.nameFr ||
                `Service #${item.serviceId.slice(0, 8)}`;
            const unitPrice = item.variant
              ? parseFloat(item.variant.priceModifier)
              : parseFloat(item.service?.basePrice || "0");
            const itemTotal = unitPrice * item.quantity;

            return (
              <motion.div
                key={item.serviceId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`h-24 w-24 shrink-0 rounded-lg bg-linear-to-br ${previewGradient} flex items-center justify-center`}
                      >
                        <HugeiconsIcon icon={IconComponent} size={40} color="white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {displayName}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {item.service?.descriptionFr || ""}
                        </p>

                        {/* Variant badge */}
                        {item.variant && (
                          <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                            Variante sélectionnée
                          </span>
                        )}

                        <div className="mt-4 flex items-center gap-4">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2 rounded-lg border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.serviceId,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                            >
                              <HugeiconsIcon icon={Remove01Icon} size={16} color="currentColor" />
                            </Button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.serviceId,
                                  item.quantity + 1,
                                )
                              }
                            >
                              <HugeiconsIcon icon={Add01Icon} size={16} color="currentColor" />
                            </Button>
                          </div>

                          {/* Price */}
                          <span className="text-xl font-black text-primary">
                            ${itemTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Remove button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.serviceId)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={20} color="currentColor" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
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
                  <span className="text-muted-foreground">Taxes (10%)</span>
                  <span className="font-medium">{taxes.toFixed(2)} USD</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-black text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button className="mt-6 w-full gap-2" size="lg" asChild>
                <Link href="/checkout">Passer commande</Link>
              </Button>

              <Button variant="outline" className="mt-3 w-full" asChild>
                <Link href="/">Continuer mes achats</Link>
              </Button>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  <span className="font-medium">Garantie satisfaction</span> •
                  Annulation gratuite sous 24h
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
