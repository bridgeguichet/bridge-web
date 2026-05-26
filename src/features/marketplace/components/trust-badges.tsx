"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Award01Icon, CheckmarkCircle01Icon, HeadphonesIcon, Shield01Icon } from "@hugeicons/core-free-icons";

const guarantees: { icon: IconSvgElement; title: string; description: string }[] = [
  {
    icon: Shield01Icon,
    title: "Paiement sécurisé",
    description: "Transactions cryptées SSL et protection des données",
  },
  {
    icon: CheckmarkCircle01Icon,
    title: "Services vérifiés",
    description: "Tous nos prestataires sont contrôlés et certifiés",
  },
  {
    icon: Award01Icon,
    title: "Satisfaction garantie",
    description: "Remboursement si le service ne correspond pas",
  },
  {
    icon: HeadphonesIcon,
    title: "Support 24/7",
    description: "Notre équipe est disponible à tout moment",
  },
];

export function TrustBadges() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {guarantees.map((guarantee, index) => (
            <motion.div
              key={guarantee.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <HugeiconsIcon icon={guarantee.icon} size={32} color="white" />
              </div>
              <h3 className="text-lg font-bold mb-2">{guarantee.title}</h3>
              <p className="text-sm text-gray-600">{guarantee.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500 mb-4">Moyens de paiement acceptés</p>
          <div className="flex flex-wrap justify-center gap-6 items-center">
            <div className="px-6 py-3 bg-white rounded-lg shadow-sm border border-gray-200 font-semibold text-gray-700">
              💵 Espèces
            </div>
            <div className="px-6 py-3 bg-white rounded-lg shadow-sm border border-gray-200 font-semibold text-gray-700">
              📱 Mobile Money
            </div>
            <div className="px-6 py-3 bg-white rounded-lg shadow-sm border border-gray-200 font-semibold text-gray-700">
              🔒 Crypté SSL
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
