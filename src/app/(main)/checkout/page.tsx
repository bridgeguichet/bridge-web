"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore } from "@/features/cart/store";
import { useServices } from "@/features/marketplace/hooks";
import { useCreateOrder } from "@/features/orders/hooks";
import { useCreateTransaction } from "@/features/transactions";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const { items, clearCart } = useCartStore();
  const { data: services } = useServices();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { mutate: createTransaction } = useCreateTransaction();

  const cartServices = items.map((item) => ({
    ...item,
    service: services?.find((s: { id: string }) => s.id === item.serviceId),
  }));

  const total = cartServices.reduce((sum, item) => {
    const price = parseFloat(item.service?.basePrice || "0");
    return sum + price * item.quantity;
  }, 0);

  const vendorIds = [
    ...new Set(cartServices.map((i) => i.service?.vendorId).filter(Boolean)),
  ];
  const hasMultipleVendors = vendorIds.length > 1;

  const handleCheckout = () => {
    if (items.length === 0) return;

    if (hasMultipleVendors) {
      toast.error(
        "Votre panier contient des services de plusieurs prestataires. Veuillez commander séparément.",
      );
      return;
    }

    const vendorId = cartServices[0].service?.vendorId;
    if (!vendorId) {
      toast.error(
        "Impossible d'identifier le prestataire. Veuillez réessayer.",
      );
      return;
    }

    createOrder(
      {
        items: items.map((item) => {
          const service = services?.find((s: { id: string }) => s.id === item.serviceId);
          const unitPrice = service?.basePrice || "0";
          return {
            serviceId: item.serviceId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice,
            totalPrice: (parseFloat(unitPrice) * item.quantity).toString(),
            metadata: item.metadata,
          };
        }),
        vendorId,
        totalAmount: total.toString(),
        paymentMethod,
      },
      {
        onSuccess: (data) => {
          // Créer une transaction locale pour cette commande
          createTransaction({
            type: "order",
            orderId: data.id,
            amount: total,
            paymentMethod: paymentMethod as "mobile_money" | "card" | "cash" | "bank_transfer",
            description: `Commande #${data.orderNumber || data.id.slice(0, 8)}`,
            items: items.map((item) => {
              const service = services?.find((s: { id: string }) => s.id === item.serviceId);
              const unitPrice = parseFloat(service?.basePrice || "0");
              const totalPrice = unitPrice * item.quantity;
              return {
                id: item.serviceId,
                name: service?.nameFr || "Service",
                description: service?.descriptionFr ?? undefined,
                quantity: item.quantity,
                unitPrice,
                totalPrice,
                category: service?.category?.nameFr,
              };
            }),
            metadata: {
              orderNumber: data.orderNumber,
              vendorId: vendorId,
            },
          });
          clearCart();
        },
      },
    );
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-muted-foreground">
          Votre panier est vide
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

      {hasMultipleVendors && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          ⚠️ Votre panier contient des services de plusieurs prestataires.
          Veuillez les commander séparément pour finaliser.
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Résumé de la commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {cartServices.map((item) => (
              <div
                key={`${item.serviceId}-${item.variantId}`}
                className="flex justify-between"
              >
                <span>
                  {item.service?.nameFr} x {item.quantity}
                </span>
                <span className="font-semibold">
                  {(
                    parseFloat(item.service?.basePrice || "0") * item.quantity
                  ).toFixed(2)}{" "}
                  USD
                </span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{total.toFixed(2)} USD</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Méthode de paiement</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash">Paiement en espèces</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mobile_money" id="mobile_money" />
              <Label htmlFor="mobile_money">Mobile Money</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Button
        onClick={handleCheckout}
        disabled={isPending}
        className="w-full"
        size="lg"
      >
        {isPending ? "Traitement..." : "Confirmer la commande"}
      </Button>
    </div>
  );
}
