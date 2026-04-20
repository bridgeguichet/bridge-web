"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Shield, Clock } from "lucide-react";

import { BorderDeco } from "@/components/ornaments/border-deco";
import { SunburstPattern } from "@/components/patterns/sunburst";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onExplore: () => void;
}

export function HeroSection({ onExplore }: HeroSectionProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-primary">
      <div className="absolute inset-0 text-accent/20">
        <SunburstPattern />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="inline-block">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-white">
                  150+ services • 2,500+ clients satisfaits
                </span>
              </div>
            </div>

            <BorderDeco className="inline-block p-8 border-2 border-white/20 bg-white/5 backdrop-blur-sm">
              <h1 className="font-batangas text-7xl md:text-[7rem] text-white leading-[0.9] tracking-tighter">
                VOTRE VIE
                <br />
                <span className="text-accent">SIMPLIFIÉE</span>
                <br />À KINSHASA
              </h1>
            </BorderDeco>

            <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-medium leading-relaxed">
              Services vérifiés • Réservation instantanée • Accompagnement
              personnalisé
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                onClick={onExplore}
                className="text-lg px-10 py-7 bg-accent text-primary hover:bg-accent/90 font-bold shadow-2xl shadow-accent/20 hover:scale-105 transition-transform"
              >
                Explorer les services →
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-7 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white font-semibold backdrop-blur-sm"
              >
                Parler à un conseiller
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span>Services vérifiés</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                <span>Support 24/7</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-16 right-16 hidden lg:flex gap-4"
        >
          <div
            className="w-32 h-32 bg-white shadow-2xl flex flex-col items-center justify-center border-4 border-accent"
            style={{
              clipPath:
                "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            }}
          >
            <div className="text-4xl font-black text-primary">150+</div>
            <div className="text-xs text-gray-600 text-center">Services</div>
          </div>
          <div
            className="w-32 h-32 bg-white shadow-2xl flex flex-col items-center justify-center border-4 border-primary"
            style={{
              clipPath:
                "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            }}
          >
            <div className="text-4xl font-black text-accent">4.8★</div>
            <div className="text-xs text-gray-600 text-center">Note</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
