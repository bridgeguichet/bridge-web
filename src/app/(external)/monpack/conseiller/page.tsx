"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, MessageCircle, UserCheck, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppointmentStep } from "@/features/appointment";
import type { AppointmentData } from "@/features/appointment";
import { usePackBuilderStore } from "@/features/pack-builder/store";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function ConseillerPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const items = usePackBuilderStore((state) => state.items);
  const wantsCounselor = usePackBuilderStore((state) => state.wantsCounselor);
  const setWantsCounselor = usePackBuilderStore((state) => state.setWantsCounselor);
  const setAppointment = usePackBuilderStore((state) => state.setAppointment);
  const getTotalAmount = usePackBuilderStore((state) => state.getTotalAmount);
  const pricingMode = usePackBuilderStore((state) => state.pricingMode);
  const userBudget = usePackBuilderStore((state) => state.userBudget);

  const isBudgetMode = pricingMode === "budget";

  const [localAppointment, setLocalAppointment] = useState<AppointmentData>({
    date: undefined,
    timeSlot: undefined,
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push("/monpack");
      return;
    }
    // En mode budget, le RDV est obligatoire, donc on pré-sélectionne "oui"
    if (isBudgetMode && wantsCounselor === null) {
      setWantsCounselor(true);
    }
  }, [items.length, router, isBudgetMode, wantsCounselor, setWantsCounselor]);

  const handleChoice = (choice: boolean) => {
    setWantsCounselor(choice);
    if (!choice) {
      setAppointment(null);
    }
  };

  const handleAppointmentChange = (data: AppointmentData) => {
    setLocalAppointment(data);
    if (data.date && data.timeSlot) {
      setAppointment(data);
    } else {
      setAppointment(null);
    }
  };

  const canProceed = isBudgetMode
    ? wantsCounselor === true && !!localAppointment.date && !!localAppointment.timeSlot
    : wantsCounselor === false || (wantsCounselor === true && !!localAppointment.date && !!localAppointment.timeSlot);

  const handleContinue = () => {
    if (isBudgetMode) {
      router.push("/monpack/confirmation");
    } else {
      router.push("/monpack/paiement");
    }
  };

  const handleBack = () => {
    if (isBudgetMode) {
      router.push("/monpack/budget");
    } else {
      router.push("/monpack");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-gray-200 border-b bg-white">
        <div className="container mx-auto px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <Button onClick={handleBack} variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("common.back")}
            </Button>
            <h1 className="font-bold text-xl text-gray-900">Votre pack personnalisé</h1>
            <div className="w-24" />
          </div>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="border-gray-200 border-b bg-white">
        <div className="container mx-auto px-6 py-4 lg:px-8">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-semibold text-white text-xs">
                ✓
              </div>
              <span className="hidden sm:inline">{t("conseillerPage.steps.services")}</span>
            </div>
            <div className="h-px w-8 bg-gray-300" />
            {isBudgetMode && (
              <>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-semibold text-white text-xs">
                    ✓
                  </div>
                  <span className="hidden sm:inline">{t("conseillerPage.steps.budget")}</span>
                </div>
                <div className="h-px w-8 bg-gray-300" />
              </>
            )}
            <div className="flex items-center gap-2 text-sm text-primary">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-semibold text-white text-xs">
                {isBudgetMode ? "3" : "2"}
              </div>
              <span className="hidden font-medium sm:inline">{t("conseillerPage.steps.counselor")}</span>
            </div>
            <div className="h-px w-8 bg-gray-300" />
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-300 font-semibold text-xs">
                {isBudgetMode ? "4" : "3"}
              </div>
              <span className="hidden sm:inline">
                {isBudgetMode ? t("conseillerPage.steps.confirmation") : t("conseillerPage.steps.payment")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Question heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="mb-4 flex justify-center">
              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${isBudgetMode ? "bg-amber-100" : "bg-primary/10"}`}>
                <MessageCircle className={`h-7 w-7 ${isBudgetMode ? "text-amber-600" : "text-primary"}`} />
              </div>
            </div>
            <h2 className="font-bold text-2xl text-gray-900 sm:text-3xl">
              {isBudgetMode ? t("conseillerPage.budgetMode.title") : t("conseillerPage.title")}
            </h2>
            <p className="mt-3 text-gray-500">
              {isBudgetMode ? t("conseillerPage.budgetMode.description") : t("conseillerPage.description")}
            </p>
            {isBudgetMode && userBudget && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2">
                <span className="text-amber-800 text-sm">{t("conseillerPage.budgetMode.yourBudget")}</span>
                <span className="font-bold text-amber-900">${userBudget}</span>
              </div>
            )}
          </motion.div>

          {/* Choice cards - only show in priced mode */}
          {!isBudgetMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {/* Oui */}
              <button
                type="button"
                onClick={() => handleChoice(true)}
                className={`group relative flex flex-col gap-4 rounded-2xl border-2 p-6 text-left transition-all duration-200 ${
                  wantsCounselor === true
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-gray-200 bg-white hover:border-primary/40 hover:shadow-sm"
                }`}
              >
                {wantsCounselor === true && (
                  <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                    wantsCounselor === true ? "bg-primary text-white" : "bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t("conseillerPage.yesOption.title")}</p>
                  <p className="mt-1 text-gray-500 text-sm">{t("conseillerPage.yesOption.description")}</p>
                </div>
                <ul className="space-y-1.5">
                  {[t("conseillerPage.yesOption.feature1"), t("conseillerPage.yesOption.feature2"), t("conseillerPage.yesOption.feature3")].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-600 text-xs">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </button>

              {/* Non */}
              <button
                type="button"
                onClick={() => handleChoice(false)}
                className={`group relative flex flex-col gap-4 rounded-2xl border-2 p-6 text-left transition-all duration-200 ${
                  wantsCounselor === false
                    ? "border-gray-400 bg-gray-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                {wantsCounselor === false && (
                  <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-500">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                    wantsCounselor === false ? "bg-gray-500 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                  }`}
                >
                  <X className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t("conseillerPage.noOption.title")}</p>
                  <p className="mt-1 text-gray-500 text-sm">{t("conseillerPage.noOption.description")}</p>
                </div>
                <ul className="space-y-1.5">
                  {[t("conseillerPage.noOption.feature1"), t("conseillerPage.noOption.feature2"), t("conseillerPage.noOption.feature3")].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-2 text-gray-600 text-xs">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </button>
            </motion.div>
          )}

          {/* AppointmentStep — shown when oui is selected OR in budget mode (mandatory) */}
          {(wantsCounselor === true || isBudgetMode) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Réserver votre rendez-vous</h3>
                  <p className="text-gray-500 text-sm">Choisissez une date et un créneau horaire qui vous convient.</p>
                </div>
              </div>
              <AppointmentStep
                onAppointmentChange={handleAppointmentChange}
                selectedServicesCount={items.length}
                totalEstimate={getTotalAmount()}
              />
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between border-gray-200 border-t pt-6">
            <Button onClick={handleBack} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("common.back")}
            </Button>

            <Button onClick={handleContinue} disabled={!canProceed} className="gap-2">
              {isBudgetMode ? t("conseillerPage.budgetMode.continue") : t("conseillerPage.continueToPayment")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
