"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import { useCartStore } from "@/features/cart/store";

import type { ServiceWithDetails } from "../types";

interface ServiceCardProps {
  service: ServiceWithDetails;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      serviceId: service.id,
      quantity: 1,
    });
    toast.success("Service ajouté au panier");
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <h3 className="text-xl font-semibold">{service.nameFr}</h3>
        {service.category && <p className="text-sm text-muted-foreground">{service.category.nameFr}</p>}
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{service.descriptionFr}</p>
        <p className="text-2xl font-bold mt-4">
          {service.basePrice} USD / {service.priceUnit}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={() => router.push(`/marketplace/services/${service.id}`)}>
          Détails
        </Button>
        <Button onClick={handleAddToCart}>Ajouter au panier</Button>
      </CardFooter>
    </Card>
  );
}
