"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/external-components/user-dashboard/empty-state";
import { useCartStore } from "@/features/cart/store";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const subtotal = items.reduce(
    (sum, item) => sum + (100) * item.quantity,
    0,
  );
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
          <h1 className="text-4xl font-black text-gray-900 md:text-5xl">
            Mon panier
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Gérez vos services avant de passer commande
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EmptyState
            icon={ShoppingCart}
            title="Votre panier est vide"
            description="Explorez nos services et ajoutez-les à votre panier pour commencer."
            action={{
              label: "Explorer les services",
              href: "/marketplace",
            }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            {items.length} article{items.length > 1 ? "s" : ""} dans votre panier
          </p>
        </div>
        <Button variant="ghost" onClick={clearCart} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Vider le panier
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.serviceId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-24 w-24 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-4xl">
                          💼
                        </span>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          Service #{item.serviceId.slice(0, 8)}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          Description du service
                        </p>
                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex items-center gap-2 rounded-lg border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.serviceId, Math.max(1, item.quantity - 1))
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.serviceId, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="text-xl font-black text-primary">
                            ${100 * item.quantity}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.serviceId)}
                        className="text-red-600"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-2xl font-black text-gray-900">Résumé</h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes (10%)</span>
                  <span className="font-semibold">${taxes.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="mt-6 w-full bg-accent text-primary hover:bg-accent/90 font-bold text-lg py-6"
                size="lg"
              >
                Passer commande
              </Button>

              <Button
                variant="outline"
                className="mt-3 w-full"
                asChild
              >
                <Link href="/marketplace">Continuer mes achats</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
