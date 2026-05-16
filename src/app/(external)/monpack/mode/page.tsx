"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calculator, DollarSign, Sparkles, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePackBuilderStore } from "@/features/pack-builder/store";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function ModePage() {
  const { t } = useTranslation();
  const router = useRouter();

  const pricingMode = usePackBuilderStore((state) => state.pricingMode);
  const setPricingMode = usePackBuilderStore((state) => state.setPricingMode);
  const clearPack = usePackBuilderStore((state) => state.clearPack);

  useEffect(() => {
    clearPack();
  }, [clearPack]);

  const handleSelectMode = (mode: "priced" | "budget") => {
    setPricingMode(mode);
  };

  const handleContinue = () => {
    if (pricingMode) {
      router.push("/monpack");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-gray-200 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <Button onClick={() => router.push("/")} variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("common.back")}
            </Button>
            <h1 className="font-bold text-xl text-gray-900">{t("monpackSection.title")}</h1>
            <div className="w-24" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-lg shadow-primary/20">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="mb-4 font-bold text-3xl text-gray-900 tracking-tight lg:text-4xl">
              {t("modeSelection.title")}
            </h2>
            <p className="mx-auto max-w-xl text-gray-600 text-lg leading-relaxed">
              {t("modeSelection.description")}
            </p>
          </motion.div>

          {/* Mode cards */}
          <div className="mb-10 grid gap-6 sm:grid-cols-2">
            {/* Mode Prix */}
            <motion.button
              type="button"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={() => handleSelectMode("priced")}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 p-8 text-left transition-all duration-300 ${
                pricingMode === "priced"
                  ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                  : "border-gray-200 bg-white hover:border-primary/40 hover:shadow-lg"
              }`}
            >
              {/* Selection indicator */}
              {pricingMode === "priced" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg"
                >
                  <span className="font-bold text-white text-xs">✓</span>
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                  pricingMode === "priced"
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary"
                }`}
              >
                <Tag className="h-8 w-8" />
              </div>

              {/* Content */}
              <h3 className="mb-2 font-bold text-gray-900 text-xl">{t("modeSelection.priced.title")}</h3>
              <p className="mb-6 text-gray-500 leading-relaxed">{t("modeSelection.priced.description")}</p>

              {/* Features */}
              <ul className="mt-auto space-y-3">
                {[
                  t("modeSelection.priced.feature1"),
                  t("modeSelection.priced.feature2"),
                  t("modeSelection.priced.feature3"),
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-600 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                      <DollarSign className="h-3 w-3 text-green-600" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.button>

            {/* Mode Budget */}
            <motion.button
              type="button"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => handleSelectMode("budget")}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 p-8 text-left transition-all duration-300 ${
                pricingMode === "budget"
                  ? "border-amber-500 bg-amber-50 shadow-xl shadow-amber-500/10"
                  : "border-gray-200 bg-white hover:border-amber-400/60 hover:shadow-lg"
              }`}
            >
              {/* Selection indicator */}
              {pricingMode === "budget" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 shadow-lg"
                >
                  <span className="font-bold text-white text-xs">✓</span>
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                  pricingMode === "budget"
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                    : "bg-gray-100 text-gray-500 group-hover:bg-amber-100 group-hover:text-amber-600"
                }`}
              >
                <Calculator className="h-8 w-8" />
              </div>

              {/* Content */}
              <h3 className="mb-2 font-bold text-gray-900 text-xl">{t("modeSelection.budget.title")}</h3>
              <p className="mb-6 text-gray-500 leading-relaxed">{t("modeSelection.budget.description")}</p>

              {/* Features */}
              <ul className="mt-auto space-y-3">
                {[
                  t("modeSelection.budget.feature1"),
                  t("modeSelection.budget.feature2"),
                  t("modeSelection.budget.feature3"),
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-600 text-sm">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100">
                      <Calculator className="h-3 w-3 text-amber-600" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.button>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center"
          >
            <Button
              onClick={handleContinue}
              disabled={!pricingMode}
              size="lg"
              className="group gap-3 rounded-2xl px-10 py-6 font-semibold text-base shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
            >
              {t("modeSelection.continue")}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
