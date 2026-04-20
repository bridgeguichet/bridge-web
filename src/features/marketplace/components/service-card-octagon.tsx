"use client";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useCartStore } from "@/features/cart/store";

import type { ServiceWithDetails } from "../types";

interface ServiceCardOctagonProps {
  service: ServiceWithDetails;
  featured?: boolean;
}

export function ServiceCardOctagon({ service, featured = false }: ServiceCardOctagonProps) {
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
    <motion.div
      whileHover={{ rotate: 2, scale: 1.03 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="h-[400px]"
    >
      <div
        className="relative h-full bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
        style={{
          clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
        }}
      >
        <div className="absolute inset-0 border-4 border-accent" style={{
          clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
        }} />

        {featured && (
          <div className="absolute top-8 left-8 w-16 h-16 bg-accent rounded-full flex items-center justify-center z-10 shadow-lg">
            <span className="text-primary font-black text-xs">TOP</span>
          </div>
        )}

        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-4">
            {service.category?.icon === "car" && "🚗"}
            {service.category?.icon === "home" && "🏠"}
            {service.category?.icon === "users" && "👥"}
            {service.category?.icon === "briefcase" && "💼"}
            {service.category?.icon === "bell" && "🔔"}
          </div>

          {service.category && (
            <div className="text-xs font-semibold text-primary/60 mb-2 uppercase tracking-wider">
              {service.category.nameFr}
            </div>
          )}

          <h3 className="text-2xl font-black mb-3 line-clamp-2 text-foreground">
            {service.nameFr}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {service.descriptionFr}
          </p>

          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>

          <div className="absolute bottom-8 right-8 text-right">
            <div className="text-4xl font-black text-primary">{service.basePrice}</div>
            <div className="text-xs text-gray-600">USD / {service.priceUnit}</div>
          </div>

          <div className="absolute bottom-8 left-8 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/marketplace/services/${service.id}`)}
              className="text-xs"
            >
              Détails
            </Button>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="bg-accent text-primary hover:bg-accent/90 font-bold text-xs"
            >
              Réserver
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
