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
  TrendingUpDownIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import { ChevronPattern } from "@/components/patterns/chevron";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";

import type { ServiceWithDetails } from "../types";

interface ServiceCardTrapezeProps {
  service: ServiceWithDetails;
  featured?: boolean;
}

export function ServiceCardTrapeze({ service, featured = false }: ServiceCardTrapezeProps) {
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
      whileHover={{ skewX: -2, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="h-[450px]"
    >
      <div
        className="relative h-full bg-primary text-white shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
        style={{
          clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
        }}
      >
        <ChevronPattern />

        {featured && (
          <div className="absolute top-0 right-12 bg-accent text-primary px-6 py-2 font-bold text-xs shadow-lg transform rotate-12 origin-top-right">
            <HugeiconsIcon icon={TrendingUpDownIcon} size={12} color="currentColor" className="inline mr-1" />
            POPULAIRE
          </div>
        )}

        <div className="relative h-full flex flex-col p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              {service.category?.icon === "car" && (
                <HugeiconsIcon icon={Car01Icon} size={56} color="rgba(255,255,255,0.9)" />
              )}
              {service.category?.icon === "home" && (
                <HugeiconsIcon icon={Home01Icon} size={56} color="rgba(255,255,255,0.9)" />
              )}
              {service.category?.icon === "users" && (
                <HugeiconsIcon icon={UserGroupIcon} size={56} color="rgba(255,255,255,0.9)" />
              )}
              {service.category?.icon === "briefcase" && (
                <HugeiconsIcon icon={Briefcase01Icon} size={56} color="rgba(255,255,255,0.9)" />
              )}
              {service.category?.icon === "bell" && (
                <HugeiconsIcon icon={Notification01Icon} size={56} color="rgba(255,255,255,0.9)" />
              )}
            </div>

            {service.category && (
              <div className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                {service.category.nameFr}
              </div>
            )}
          </div>

          <h3 className="text-2xl font-black mb-3 line-clamp-2">{service.nameFr}</h3>

          <p className="text-sm text-white/80 line-clamp-3 mb-4 flex-1">{service.descriptionFr}</p>

          <div className="flex items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <HugeiconsIcon key={i} icon={StarIcon} size={16} color="rgb(250,204,21)" />
            ))}
            <span className="text-xs ml-2">(4.8)</span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-4xl font-black text-accent">{service.basePrice}</div>
              <div className="text-xs text-white/70">USD / {service.priceUnit}</div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/marketplace/services/${service.id}`)}
                className="text-white hover:bg-white/10 text-xs"
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
      </div>
    </motion.div>
  );
}
