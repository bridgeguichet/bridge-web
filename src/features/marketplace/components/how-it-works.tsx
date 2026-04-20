"use client";

import { motion } from "framer-motion";
import { Search, ShoppingCart, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

const steps = [
  {
    number: 1,
    icon: Search,
    title: "Choisissez votre service",
    description:
      "Parcourez notre catalogue de services vérifiés et sélectionnez celui qui vous convient",
  },
  {
    number: 2,
    icon: ShoppingCart,
    title: "Réservez en 2 clics",
    description:
      "Ajoutez au panier, choisissez votre mode de paiement et confirmez votre réservation",
  },
  {
    number: 3,
    icon: CheckCircle,
    title: "Profitez du service",
    description:
      "Notre équipe s'occupe de tout. Vous recevez une confirmation et un suivi en temps réel",
  },
];

interface HowItWorksProps {
  onGetStarted: () => void;
}

export function HowItWorks({ onGetStarted }: HowItWorksProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600">Simple, rapide et sécurisé</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 relative">
          <div className="hidden md:block absolute top-1/4 left-0 right-0 h-1 bg-accent/30 -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative text-center"
            >
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-xl">
                  <step.icon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">
                  {step.number}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={onGetStarted}
            className="text-lg px-10 py-6 bg-accent text-primary hover:bg-accent/90 font-bold"
          >
            Commencer maintenant
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
