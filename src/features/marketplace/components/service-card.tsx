"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Briefcase01Icon,
  Car01Icon,
  FavouriteIcon,
  Home01Icon,
  Notification01Icon,
  StarIcon,
  UserGroupIcon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { useAuthRedirect, useSession } from "@/features/auth/hooks";
import { getCardImageUrl } from "@/lib/cloudinary/client";
import { useCartStore } from "@/features/cart/store";
import { useFavoritesStore } from "@/features/marketplace/store";
import { cn } from "@/lib/utils";

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

const PREVIEW_ICONS: Record<string, typeof Car01Icon> = {
  car: Car01Icon,
  home: Home01Icon,
  users: UserGroupIcon,
  briefcase: Briefcase01Icon,
  bell: Notification01Icon,
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

const AVATAR_COLORS = ["bg-violet-500", "bg-rose-400", "bg-emerald-500", "bg-amber-500", "bg-sky-500"];

export function ServiceCard({ service, featured = false, badgeIndex = 0 }: ServiceCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated } = useSession();
  const { redirectToLogin } = useAuthRedirect();
  const toggle = useFavoritesStore((state) => state.toggle);
  const liked = useFavoritesStore((state) => state.isLiked(service.id));

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      redirectToLogin(`/marketplace/services/${service.id}`);
      return;
    }
    toggle(service.id);
  };

  const _handleAddToCart = () => {
    addItem({ serviceId: service.id, quantity: 1 });
    toast.success("Service ajouté au panier");
  };

  const icon = service.category?.icon || "briefcase";
  const previewGradient = PREVIEW_COLORS[icon] ?? "from-gray-400 to-gray-600";
  const IconComponent = PREVIEW_ICONS[icon] ?? Briefcase01Icon;
  const badge = featured ? BADGES[badgeIndex % BADGES.length] : null;
  const avatarColor = AVATAR_COLORS[badgeIndex % AVATAR_COLORS.length];
  const initials = service.nameFr.slice(0, 2).toUpperCase();
  const optimizedImageUrl = getCardImageUrl(service.imageUrl, 600, 400);

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
      onClick={() => router.push(`/marketplace/services/${service.id}`)}
    >
      {/* Preview image zone */}
      <div className={cn("relative h-44 bg-linear-to-br", service.imageUrl ? "" : previewGradient)}>
        {optimizedImageUrl ? (
          <img src={optimizedImageUrl} alt={service.nameFr} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <HugeiconsIcon icon={IconComponent} size={96} color="rgba(255,255,255,0.3)" />
            </div>
            {/* Fake UI overlay to mimic a screenshot */}
            <div className="absolute inset-4 flex flex-col gap-1.5 rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
              <div className="h-2 w-3/4 rounded-full bg-white/40" />
              <div className="h-2 w-1/2 rounded-full bg-white/30" />
              <div className="h-2 w-2/3 rounded-full bg-white/20" />
            </div>
          </>
        )}
        {/* Favorite button */}
        <button
          type="button"
          className={cn(
            "absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-all duration-200",
            liked ? "scale-110 bg-rose-500 shadow-rose-300/60" : "bg-white hover:scale-110 hover:bg-rose-50",
          )}
          onClick={handleToggleFavorite}
          aria-label="Favori"
        >
          {liked && <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/50" />}
          <HugeiconsIcon icon={FavouriteIcon} size={18} color={liked ? "rgb(255,255,255)" : "rgb(156,163,175)"} />
        </button>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Provider row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm", avatarColor)}
            >
              <span className="font-bold text-white text-xs">{initials}</span>
            </div>
            <div>
              {badge && (
                <div
                  className={cn(
                    "mb-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold text-[10px]",
                    badge.bg,
                    badge.text,
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />
                  {badge.label}
                </div>
              )}
              <p className="font-semibold text-gray-800 text-sm leading-none">
                {service.nameFr.split(" ").slice(0, 3).join(" ")}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-gray-500 text-xs leading-relaxed">{service.descriptionFr}</p>

        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <HugeiconsIcon key={i} icon={StarIcon} size={12} color="rgb(250,204,21)" />
          ))}
          <span className="ml-1 text-gray-500 text-xs">(4.8)</span>
        </div>

        {/* Video consultation badge */}
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <HugeiconsIcon icon={Video01Icon} size={12} color="currentColor" />
          <span>Consultation vidéo disponible</span>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between border-gray-50 border-t pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-gray-400 text-xs">Dès</span>
            <span className="font-black text-gray-900 text-lg">${service.basePrice}</span>
            <span className="text-gray-400 text-xs">/{service.priceUnit}</span>
          </div>
          <Link
            href={`/marketplace/services/${service.id}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground text-xs transition-colors hover:bg-primary/90"
          >
            Voir détails
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
