"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onExplore: () => void;
  onSearch?: (query: string) => void;
}

const AVATARS = [
  {
    label: "Chauffeur",
    image: "/media/img_chauffeur.jpg",
    initials: "AK",
    color: "bg-violet-500",
    top: "8%",
    right: "22%",
  },
  {
    label: "Cuisinière",
    image: "/media/cuisiniere.jpg",
    initials: "MN",
    color: "bg-rose-400",
    top: "18%",
    right: "5%",
  },
  {
    label: "Agent immo",
    image: "/media/agent_immo.jpg",
    initials: "JD",
    color: "bg-emerald-500",
    top: "52%",
    right: "18%",
  },
  {
    label: "Gardien",
    image: "/media/gardien.jpg",
    initials: "PL",
    color: "bg-amber-500",
    top: "68%",
    right: "2%",
  },
];

const SHAPES = [
  { type: "circle", size: 180, top: "0%", right: "30%", color: "bg-pink-200" },
  { type: "circle", size: 140, top: "30%", right: "0%", color: "bg-lime-200" },
  { type: "triangle", top: "55%", right: "28%", color: "border-b-violet-200" },
  { type: "circle", size: 100, top: "70%", right: "12%", color: "bg-sky-200" },
];

export function HeroSection({ onExplore, onSearch }: HeroSectionProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    else onExplore();
  };

  return (
    <section className="relative overflow-hidden" style={{ background: "oklch(0.97 0.008 260)" }}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 min-h-[560px] items-center gap-8 py-20">
          {/* Left — content */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 max-w-xl"
          >
            <h1 className="text-5xl lg:text-[3.75rem] font-black leading-[1.05] tracking-tight text-gray-900">
              Connectons vos besoins
              <br />
              <span className="text-primary">à Kinshasa</span>
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed">
              Trouvez des prestataires vérifiés pour tous vos besoins — de la maison au bureau, livraison immédiate.
            </p>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un service…"
                className="flex-1 px-5 py-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
              />
              <Button
                type="submit"
                className="m-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-5 h-10"
              >
                <HugeiconsIcon icon={Search01Icon} size={20} color="currentColor" />
              </Button>
            </form>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2">
              {["Chauffeur privé", "Nettoyage domicile", "Aide administrative", "Livraison"].map((s) => (
                <button
                  key={s}
                  onClick={onExplore}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Trust strip */}
            <div className="flex items-center gap-6 pt-2 text-sm text-gray-400">
              <span className="font-semibold text-gray-700">150+</span> services
              <span className="w-px h-4 bg-gray-200" />
              <span className="font-semibold text-gray-700">2 500+</span> clients satisfaits
              <span className="w-px h-4 bg-gray-200" />
              <span className="font-semibold text-gray-700">4.8★</span> note moyenne
            </div>
          </motion.div>

          {/* Right — floating avatars */}
          <div className="relative hidden lg:block h-[480px]">
            {/* Background shapes */}
            {SHAPES.map((shape, i) => (
              <div key={i} className="absolute" style={{ top: shape.top, right: shape.right }}>
                {shape.type === "circle" && (
                  <div
                    className={`rounded-full opacity-70 ${shape.color}`}
                    style={{ width: shape.size, height: shape.size }}
                  />
                )}
                {shape.type === "triangle" && (
                  <div
                    className="w-0 h-0 opacity-60"
                    style={{
                      borderLeft: "60px solid transparent",
                      borderRight: "60px solid transparent",
                      borderBottom: "104px solid oklch(0.88 0.08 290 / 0.6)",
                    }}
                  />
                )}
              </div>
            ))}

            {/* Avatar cards */}
            {AVATARS.map((avatar, i) => (
              <motion.div
                key={avatar.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute flex flex-col items-center gap-1.5"
                style={{ top: avatar.top, right: avatar.right }}
              >
                <div
                  className={`w-20 h-20 rounded-full ${avatar.color} flex items-center justify-center shadow-xl border-4 border-white overflow-hidden`}
                >
                  {avatar.image ? (
                    <img src={avatar.image} alt={avatar.label} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-black text-lg">{avatar.initials}</span>
                  )}
                </div>
                <div className="bg-white rounded-full px-3 py-1 text-xs font-semibold text-gray-700 shadow-md border border-gray-100">
                  {avatar.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
