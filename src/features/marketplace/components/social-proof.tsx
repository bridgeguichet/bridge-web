"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { QuoteUpIcon, StarIcon } from "@hugeicons/core-free-icons";

const testimonials = [
  {
    id: 1,
    name: "Marie Kabongo",
    role: "Diaspora - Paris",
    content:
      "Bridge a transformé mon retour à Kinshasa. J'ai pu tout organiser depuis la France : logement, chauffeur, personnel. Un service exceptionnel !",
    rating: 5,
    avatar: "MK",
  },
  {
    id: 2,
    name: "Jean-Pierre Mukendi",
    role: "Expatrié - Kinshasa",
    content:
      "En tant qu'expatrié, j'avais besoin d'aide pour m'installer. Bridge m'a accompagné à chaque étape. Je recommande vivement !",
    rating: 5,
    avatar: "JP",
  },
  {
    id: 3,
    name: "Sarah Tshimanga",
    role: "Investisseur",
    content:
      "Services professionnels et fiables. J'ai trouvé tout ce dont j'avais besoin pour mes projets à Kinshasa. Équipe très réactive.",
    rating: 5,
    avatar: "ST",
  },
];

export function SocialProof() {
  return (
    <section className="py-20 bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <HugeiconsIcon icon={StarIcon} size={20} color="rgb(250,204,21)" />
            <span className="font-bold">4.8/5 sur 2,500+ avis</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-4">Ils nous font confiance</h2>
          <p className="text-xl opacity-90">Découvrez ce que nos clients disent de nous</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 relative"
            >
              <HugeiconsIcon icon={QuoteUpIcon} size={32} color="currentColor" className="text-primary/30 mb-4" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-lg">{testimonial.name}</div>
                  <div className="text-sm opacity-75">{testimonial.role}</div>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <HugeiconsIcon key={i} icon={StarIcon} size={16} color="rgb(250,204,21)" />
                ))}
              </div>

              <p className="text-white/90 leading-relaxed">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-lg font-semibold">
            🔥 <span className="text-yellow-300">47 personnes</span> ont réservé un service aujourd'hui
          </p>
        </motion.div>
      </div>
    </section>
  );
}
