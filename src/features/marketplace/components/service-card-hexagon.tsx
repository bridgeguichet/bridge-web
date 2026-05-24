"use client";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notification01Icon,
  Briefcase01Icon,
  Car01Icon,
  Home01Icon,
  StarIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import { ZigzagPattern } from "@/components/patterns/zigzag";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";

import type { ServiceWithDetails } from "../types";

interface ServiceCardHexagonProps {
  service: ServiceWithDetails;
  featured?: boolean;
}

export function ServiceCardHexagon({ service, featured = false }: ServiceCardHexagonProps) {
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
      whileHover={{ rotateY: -5, scale: 1.03 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: "1000px" }}
      className="h-[380px]"
    >
      <div
        className="relative h-full bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
        style={{
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        }}
      >
        <div
          className="absolute inset-0 border-[6px] border-primary"
          style={{
            clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          }}
        />
        <div
          className="absolute inset-[6px] border-2 border-accent"
          style={{
            clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          }}
        />

        <ZigzagPattern />

        {featured && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-accent text-primary px-4 py-1 font-bold text-xs rounded-full shadow-lg z-10">
            ⭐ RECOMMANDÉ
          </div>
        )}

        <div className="relative h-full flex flex-col items-center justify-center p-10 text-center">
          <div className="mb-4">
            {service.category?.icon === "car" && <HugeiconsIcon icon={Car01Icon} size={56} color="currentColor" className="text-primary/80" />}
            {service.category?.icon === "home" && <HugeiconsIcon icon={Home01Icon} size={56} color="currentColor" className="text-primary/80" />}
            {service.category?.icon === "users" && <HugeiconsIcon icon={UserGroupIcon} size={56} color="currentColor" className="text-primary/80" />}
            {service.category?.icon === "briefcase" && <HugeiconsIcon icon={Briefcase01Icon} size={56} color="currentColor" className="text-primary/80" />}
            {service.category?.icon === "bell" && <HugeiconsIcon icon={Notification01Icon} size={56} color="currentColor" className="text-primary/80" />}
          </div>

          {service.category && (
            <div className="text-xs font-semibold text-primary/60 mb-3 uppercase tracking-wider">
              {service.category.nameFr}
            </div>
          )}

          <h3 className="text-xl font-black mb-2 line-clamp-2 text-foreground">{service.nameFr}</h3>

          <p className="text-xs text-gray-600 line-clamp-2 mb-4">{service.descriptionFr}</p>

          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <HugeiconsIcon key={i} icon={StarIcon} size={12} color="rgb(250,204,21)" />
            ))}
          </div>

          <div className="mb-4">
            <div className="text-3xl font-black text-primary">{service.basePrice}</div>
            <div className="text-xs text-gray-600">USD / {service.priceUnit}</div>
          </div>

          <div className="flex gap-2">
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
