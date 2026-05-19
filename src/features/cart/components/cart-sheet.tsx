"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Briefcase01Icon,
  Car01Icon,
  Home01Icon,
  Remove01Icon,
  Package01Icon,
  Add01Icon,
  ShoppingBag01Icon,
  Delete01Icon,
  UserGroupIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { Lock, ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/features/cart/store";
import { useServices } from "@/features/marketplace/hooks";
import { useSession } from "@/features/auth/hooks";

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

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { data: services } = useServices();
  const { isAuthenticated } = useSession();

  const cartServices = items.map((item) => ({
    ...item,
    service: services?.find((s) => s.id === item.serviceId),
    variant: services
      ?.find((s) => s.id === item.serviceId)
      ?.variants?.find((v) => v.id === item.variantId),
  }));

  const subtotal = cartServices.reduce((sum, item) => {
    const price = item.variant
      ? item.variant.priceModifier
      : item.service?.basePrice || "0";
    return sum + parseFloat(price) * item.quantity;
  }, 0);

  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  const handleCheckout = () => {
    if (isAuthenticated) {
      onOpenChange(false);
      router.push("/checkout");
    } else {
      onOpenChange(false);
      router.push("/auth/login");
    }
  };

  const handleExplore = () => {
    onOpenChange(false);
    router.push("/marketplace#services");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col w-full sm:max-w-md p-0 gap-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl font-black text-gray-900">
                Votre panier
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                {items.length === 0
                  ? "Connectez-vous pour finaliser votre commande"
                  : `${items.length} article${items.length > 1 ? "s" : ""} dans votre panier`}
              </SheetDescription>
            </div>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0 h-8 px-2 text-xs"
              >
                <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" className="mr-1" />
                Vider
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full px-6 py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                <HugeiconsIcon icon={ShoppingBag01Icon} size={36} color="currentColor" className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Votre panier est vide
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Découvrez nos services et ajoutez-les à votre panier
              </p>
              <Button className="rounded-full px-6" asChild>
                <Link href="/">
                  Explorer les services
                </Link>
              </Button>

            </div>
          ) : (
            /* Cart items */
            <div className="px-4 py-4 space-y-3">
              <AnimatePresence initial={false}>
                {cartServices.map((item, index) => {
                  const icon = item.service?.category?.icon || "briefcase";
                  const previewGradient = PREVIEW_COLORS[icon] ?? "from-gray-400 to-gray-500";
                  const IconComponent = PREVIEW_ICONS[icon] ?? Briefcase01Icon;
                  const displayName = item.variant
                    ? `${item.service?.nameFr} — ${item.variant.nameFr}`
                    : item.service?.nameFr || `Service #${item.serviceId.slice(0, 8)}`;
                  const unitPrice = item.variant
                    ? parseFloat(item.variant.priceModifier)
                    : parseFloat(item.service?.basePrice || "0");
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <motion.div
                      key={`${item.serviceId}-${item.variantId}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      {/* Icon */}
                      <div
                        className={`h-14 w-14 shrink-0 rounded-lg bg-linear-to-br ${previewGradient} flex items-center justify-center`}
                      >
                        <HugeiconsIcon icon={IconComponent} size={24} color="white" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                          {displayName}
                        </p>
                        {item.variant && (
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary mt-1">
                            Variante
                          </span>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {/* Quantity */}
                          <div className="flex items-center gap-1 rounded-lg border bg-white h-7">
                            <button
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                              onClick={() =>
                                updateQuantity(
                                  item.serviceId,
                                  Math.max(1, item.quantity - 1),
                                  item.variantId,
                                )
                              }
                            >
                              <HugeiconsIcon icon={Remove01Icon} size={12} color="currentColor" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                              onClick={() =>
                                updateQuantity(
                                  item.serviceId,
                                  item.quantity + 1,
                                  item.variantId,
                                )
                              }
                            >
                              <HugeiconsIcon icon={Add01Icon} size={12} color="currentColor" />
                            </button>
                          </div>
                          <span className="text-sm font-black text-primary ml-1">
                            {itemTotal.toFixed(2)} USD
                          </span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.serviceId, item.variantId)}
                        className="text-gray-300 hover:text-red-500 transition-colors mt-0.5 shrink-0"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={16} color="currentColor" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer — always visible */}
        {items.length > 0 && (
          <SheetFooter className="flex flex-col gap-0 p-0 border-t">
            <div className="px-6 pt-5 pb-4 space-y-3">
              {/* Auth notice */}
              {!isAuthenticated && (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/5 mb-1">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary leading-tight">Connexion requise</p>
                    <p className="text-xs text-muted-foreground">Pour passer commande</p>
                  </div>
                </div>
              )}

              {/* Totals */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium text-primary">{subtotal.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frais de service (5%)</span>
                <span className="font-medium text-primary">{serviceFee.toFixed(2)} USD</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-black text-primary">{total.toFixed(2)} USD</span>
              </div>

              {/* CTA */}
              <Button
                className="w-full gap-2 mt-1 rounded-xl h-11"
                onClick={handleCheckout}
              >
                <User className="h-4 w-4" />
                {isAuthenticated ? "Passer commande" : "Se connecter pour payer"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                En passant commande, vous acceptez nos{" "}
                <SheetClose asChild>
                  <Link href="/cgu" className="underline hover:text-primary">
                    conditions de service
                  </Link>
                </SheetClose>
              </p>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
