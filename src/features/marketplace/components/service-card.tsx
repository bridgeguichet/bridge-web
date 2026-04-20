"use client";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { useCartStore } from "@/features/cart/store";

import type { ServiceWithDetails } from "../types";

interface ServiceCardProps {
  service: ServiceWithDetails;
  featured?: boolean;
}

export function ServiceCard({ service, featured = false }: ServiceCardProps) {
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
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col group">
        <div className="relative h-48 bg-primary overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20">
              {service.category?.icon === "car" && "🚗"}
              {service.category?.icon === "home" && "🏠"}
              {service.category?.icon === "users" && "👥"}
              {service.category?.icon === "briefcase" && "💼"}
              {service.category?.icon === "bell" && "🔔"}
            </div>
          </div>

          {featured && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <TrendingUp className="w-3 h-3" />
              Populaire
            </div>
          )}

          {service.category && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
              {service.category.nameFr}
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-6">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {service.nameFr}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {service.descriptionFr}
          </p>

          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">(4.8)</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary">
              {service.basePrice}
            </span>
            <span className="text-gray-600">USD / {service.priceUnit}</span>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/marketplace/services/${service.id}`)}
            className="flex-1"
          >
            Détails
          </Button>
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="flex-1 bg-accent text-primary hover:bg-accent/90 font-bold"
          >
            Réserver
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
