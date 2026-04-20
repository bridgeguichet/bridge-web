"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

interface FinalCTAProps {
  onExplore: () => void;
}

export function FinalCTA({ onExplore }: FinalCTAProps) {
  return (
    <section className="py-20 bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Prêt à simplifier votre vie à Kinshasa ?
          </h2>

          <p className="text-xl md:text-2xl mb-10 opacity-95">
            Rejoignez plus de 2,500 clients satisfaits qui font confiance à
            Bridge pour leurs services quotidiens
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onExplore}
              className="text-lg px-10 py-6 bg-accent text-primary hover:bg-accent/90 shadow-2xl font-bold"
            >
              Explorer les services
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-6 border-2 border-white text-white hover:bg-white/10"
            >
              Parler à un conseiller
            </Button>
          </div>

          <p className="mt-8 text-sm opacity-75">
            ✨ Aucune carte bancaire requise • 🔒 Paiement 100% sécurisé • ⚡
            Réservation instantanée
          </p>
        </motion.div>
      </div>
    </section>
  );
}
