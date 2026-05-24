"use client";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { ArrowRight, BarChart2, ClipboardList, Lightbulb, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthRedirect, useSession } from "@/features/auth/hooks";
import { useTranslation } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

interface MonPackProps {
  className?: string;
}

const STEPS = [
  { icon: ClipboardList, key: "step1" as const },
  { icon: BarChart2, key: "step2" as const },
  { icon: Lightbulb, key: "step3" as const },
  { icon: UserCheck, key: "step4" as const },
];

export default function MonPack({ className }: MonPackProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated } = useSession();
  const { redirectToLogin } = useAuthRedirect();

  const handleStartCustomization = () => {
    if (!isAuthenticated) {
      redirectToLogin("/monpack/mode");
      return;
    }
    router.push("/monpack/mode");
  };

  return (
    <section className={cn("bg-background py-16 lg:py-20", className)}>
      <div className="container mx-auto px-6 lg:px-8">
        {/* Title & description — outside the card */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-3 font-bold text-3xl text-foreground tracking-tight lg:text-4xl"
          >
            {t("monpackSection.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-base text-muted-foreground leading-relaxed lg:text-lg"
          >
            {t("monpackSection.description")}
          </motion.p>
        </div>

        {/* Dark card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-secondary px-8 py-12 shadow-2xl lg:px-14 lg:py-16"
        >
          {/* Steps row */}
          <div className="mb-12 flex flex-col items-start gap-8 sm:flex-row sm:items-start sm:gap-0">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex flex-1 flex-row items-center sm:flex-col sm:items-center">
                  {/* Step block */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.12, duration: 0.4 }}
                    className="flex flex-col items-center"
                  >
                    {/* Number badge */}
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md">
                      {index + 1}
                    </div>
                    {/* Icon box */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 shadow-inner ring-1 ring-white/10 lg:h-16 lg:w-16">
                      <Icon className="h-7 w-7 text-primary lg:h-8 lg:w-8" />
                    </div>
                    {/* Label */}
                    <p className="mt-3 max-w-[120px] text-center text-sm leading-snug text-secondary-foreground/80 lg:max-w-[140px]">
                      {t(`monpackSection.steps.${step.key}`)}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="mb-8 h-px w-full bg-white/10" />

          {/* CTA */}
          <div className="flex flex-col items-center gap-5 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65, duration: 0.4 }}
              className="flex flex-col items-center gap-3"
            >
              <Button
                onClick={handleStartCustomization}
                size="lg"
                className="group gap-2 rounded-2xl px-10 py-6 font-semibold text-base shadow-lg transition-all hover:shadow-xl"
              >
                {t("monpackSection.cta")}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <p className="text-xs text-secondary-foreground/40">{t("monpackSection.badge2")}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
