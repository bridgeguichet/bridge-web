"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

import { motion } from "framer-motion";
import { Heart, Star, Video } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { useCartStore } from "@/features/cart/store";

import type { ServiceWithDetails } from "../types";

interface ServiceCardProps {
  service: ServiceWithDetails;
  featured?: boolean;
  badgeIndex?: number;
}

const PREVIEW_COLORS: Record<string, string> = {
  car: "from-violet-500 to-violet-700",
  home: "from-rose-500 to-rose-700",
  users: "from-emerald-500 to-emerald-700",
  briefcase: "from-amber-500 to-amber-700",
  bell: "from-sky-500 to-sky-700",
};

const PREVIEW_EMOJI: Record<string, string> = {
  car: "🚗",
  home: "🏠",
  users: "👥",
  briefcase: "💼",
  bell: "🔔",
};

const BADGES = [
  {
    label: "Top Noté",
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  {
    label: "Plus Vué",
    bg: "bg-sky-100",
    text: "text-sky-700",
    dot: "bg-sky-500",
  },
  {
    label: "Choix clients",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  {
    label: "Expert",
    bg: "bg-violet-100",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
];

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-rose-400",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-sky-500",
];

export function ServiceCard({
  service,
  featured = false,
  badgeIndex = 0,
}: ServiceCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [liked, setLiked] = useState(false);

  const handleAddToCart = () => {
    addItem({ serviceId: service.id, quantity: 1 });
    toast.success("Service ajouté au panier");
  };

  const icon = service.category?.icon || "briefcase";
  const previewGradient = PREVIEW_COLORS[icon] ?? "from-gray-400 to-gray-600";
  const emoji = PREVIEW_EMOJI[icon] ?? "💼";
  const badge = featured ? BADGES[badgeIndex % BADGES.length] : null;
  const avatarColor = AVATAR_COLORS[badgeIndex % AVATAR_COLORS.length];
  const initials = service.nameFr.slice(0, 2).toUpperCase();

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
      onClick={() => router.push(`/marketplace/services/${service.id}`)}
    >
      {/* Preview image zone */}
      <div className={cn("relative h-44 bg-linear-to-br", previewGradient)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl opacity-30 select-none" aria-hidden>
            {emoji}
          </span>
        </div>
        {/* Fake UI overlay to mimic a screenshot */}
        <div className="absolute inset-4 bg-white/10 rounded-xl border border-white/20 flex flex-col gap-1.5 p-3 backdrop-blur-sm">
          <div className="h-2 w-3/4 bg-white/40 rounded-full" />
          <div className="h-2 w-1/2 bg-white/30 rounded-full" />
          <div className="h-2 w-2/3 bg-white/20 rounded-full" />
        </div>
        {/* Favorite button */}
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
          onClick={(e) => {
            e.stopPropagation();
            setLiked((l) => !l);
          }}
          aria-label="Favori"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              liked ? "fill-rose-500 text-rose-500" : "text-gray-400",
            )}
          />
        </button>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Provider row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center shadow-sm shrink-0",
                avatarColor,
              )}
            >
              <span className="text-white font-bold text-xs">{initials}</span>
            </div>
            <div>
              {badge && (
                <div
                  className={cn(
                    "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-0.5",
                    badge.bg,
                    badge.text,
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", badge.dot)} />
                  {badge.label}
                </div>
              )}
              <p className="text-sm font-semibold text-gray-800 leading-none">
                {service.nameFr.split(" ").slice(0, 3).join(" ")}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {service.descriptionFr}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.8)</span>
        </div>

        {/* Video consultation badge */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Video className="w-3 h-3" />
          <span>Consultation vidéo disponible</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-gray-400">Dès</span>
            <span className="text-lg font-black text-gray-900">
              ${service.basePrice}
            </span>
            <span className="text-xs text-gray-400">/{service.priceUnit}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="text-xs font-semibold px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Réserver
          </button>
        </div>
      </div>
    </motion.div>
  );
}
