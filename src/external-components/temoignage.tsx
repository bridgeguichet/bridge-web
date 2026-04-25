"use client";

import Image from "next/image";

import { Play, Quote } from "lucide-react";

import { useTranslation } from "@/lib/i18n/use-translation";

const mockTestimonials = [
  {
    id: "1",
    name: "Matilde Tetela",
    role: "Entrepreneur, Fondatrice - SiteKrafter, Filmora",
    text: "Grâce à Bridge, j'ai pu lancer mon entreprise à Kinshasa ! L'équipe m'a accompagnée à chaque étape : création juridique, compte bancaire, bureaux équipés... Tout était fluide et professionnel. En 3 mois, mon chiffre d'affaires a déjà dépassé mes projections. Une vraie révolution pour les entrepreneurs de la diaspora !",
    imageUrl: "/media/image-nextgen.jpg",
    videoUrl: null,
    featured: true,
  },
  {
    id: "2",
    name: "Marie Kabongo",
    role: "Investisseuse, Diaspora",
    text: "Bridge m'a permis de réaliser mon projet d'investissement à Kinshasa en toute sérénité. L'accompagnement est professionnel et les services sont de qualité.",
    imageUrl: "/media/image-retraite.jpg",
    videoUrl: null,
    featured: false,
  },
  {
    id: "3",
    name: "Jean-Pierre Mukendi",
    role: "Expatrié, Consultant",
    text: "Une plateforme indispensable pour tout expatrié à Kinshasa. Les démarches sont simplifiées et le suivi est excellent.",
    imageUrl: "/media/image-invest.jpg",
    videoUrl: null,
    featured: false,
  },
];

export default function TemoingageSection() {
  const { t } = useTranslation();

  return (
    <section id="temoignage" className="bg-linear-to-b from-white to-gray-50 py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-black text-4xl text-gray-900 tracking-tight">{t("testimonialSection.title")}</h2>
          <p className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <span className="inline-flex items-center gap-1">
              <svg
                className="h-4 w-4 fill-current text-primary"
                viewBox="0 0 20 20"
                role="img"
                aria-label="Rating star"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {t("testimonialSection.subtitle")}
            </span>
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mockTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="relative aspect-video">
                <Image
                  src={testimonial.imageUrl}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {testimonial.videoUrl && (
                  <button
                    type="button"
                    className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 hover:bg-black/30"
                    aria-label="Play video"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl">
                      <Play className="ml-1 h-6 w-6 text-primary" fill="currentColor" />
                    </div>
                  </button>
                )}
              </div>

              <div className="p-6">
                <Quote className="mb-4 h-8 w-8 text-primary" />
                <p className="mb-6 line-clamp-4 text-gray-700">{testimonial.text}</p>
                <div className="border-gray-100 border-t pt-4">
                  <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
