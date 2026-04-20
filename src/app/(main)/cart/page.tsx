"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { useCartStore } from "@/features/cart/store";
import { useServices } from "@/features/marketplace/hooks";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, clearCart } = useCartStore();
  const { data: services } = useServices();

  const cartServices = items.map((item) => ({
    ...item,
    service: services?.find((s) => s.id === item.serviceId),
  }));

  const total = cartServices.reduce((sum, item) => {
    const price = parseFloat(item.service?.basePrice || "0");
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Panier</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Votre panier est vide</p>
          <Button onClick={() => router.push("/marketplace")}>Découvrir nos services</Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartServices.map((item) => (
              <div key={`${item.serviceId}-${item.variantId}`} className="flex justify-between items-center border p-4 rounded">
                <div>
                  <h3 className="font-semibold">{item.service?.nameFr}</h3>
                  <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold">{(parseFloat(item.service?.basePrice || "0") * item.quantity).toFixed(2)} USD</p>
                  <Button variant="destructive" size="sm" onClick={() => removeItem(item.serviceId, item.variantId)}>
                    Retirer
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Total</h2>
              <p className="text-2xl font-bold">{total.toFixed(2)} USD</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={clearCart}>
                Vider le panier
              </Button>
              <Button onClick={() => router.push("/checkout")}>Passer commande</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
