"use client";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { ArrowRight, Check, Package, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

interface MonPackProps {
  className?: string;
}

export default function MonPack({ className }: MonPackProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleStartCustomization = () => {
    router.push("/monpack");
  };

  return (
    <section className={cn("bg-white py-16 lg:py-20", className)}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Content */}
          <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 lg:h-20 lg:w-20"
              >
                <Package className="h-8 w-8 text-gray-600 lg:h-10 lg:w-10" />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mb-4 font-bold text-3xl text-gray-900 tracking-tight lg:text-4xl"
              >
                {t("monpackSection.title")}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mb-8 max-w-2xl text-base text-gray-600 leading-relaxed lg:text-lg"
              >
                {t("monpackSection.description")}
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mb-8 flex flex-wrap items-center justify-center gap-4 lg:gap-6"
              >
                {[
                  t("monpackSection.features.guided"),
                  t("monpackSection.features.realtime"),
                  t("monpackSection.features.autosave"),
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <Button
                  onClick={handleStartCustomization}
                  size="lg"
                  className="group gap-2 px-8 py-6 font-semibold text-base shadow-lg transition-all rounded-2xl hover:shadow-xl"
                >
                  {t("monpackSection.cta")}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </div>
        </div>
      </div>
    </section>
  );
}