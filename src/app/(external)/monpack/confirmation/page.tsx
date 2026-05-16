"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { ArrowLeft, CalendarCheck, CheckCircle, Clock, DollarSign, Home, Package, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePackBuilderStore } from "@/features/pack-builder/store";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function ConfirmationPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const items = usePackBuilderStore((state) => state.items);
  const pricingMode = usePackBuilderStore((state) => state.pricingMode);
  const userBudget = usePackBuilderStore((state) => state.userBudget);
  const appointment = usePackBuilderStore((state) => state.appointment);
  const clearPack = usePackBuilderStore((state) => state.clearPack);

  useEffect(() => {
    if (pricingMode !== "budget" || items.length === 0 || !appointment?.date || !appointment?.timeSlot) {
      router.push("/monpack/mode");
    }
  }, [pricingMode, items.length, appointment, router]);

  const handleReturnHome = () => {
    clearPack();
    router.push("/");
  };

  if (!appointment?.date || !appointment?.timeSlot) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-gray-50">
      {/* Header */}
      <div className="border-gray-200 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <Button onClick={() => router.push("/monpack/conseiller")} variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("common.back")}
            </Button>
            <h1 className="font-bold text-xl text-gray-900">{t("monpackSection.title")}</h1>
            <div className="w-24" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Success header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-lg shadow-green-200">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h2 className="mb-3 font-bold text-3xl text-gray-900">{t("confirmationPage.title")}</h2>
            <p className="text-gray-600 text-lg">{t("confirmationPage.description")}</p>
          </motion.div>

          <div className="space-y-6">
            {/* Appointment card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CalendarCheck className="h-5 w-5 text-amber-600" />
                    {t("confirmationPage.appointment.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                      <User className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t("confirmationPage.appointment.counselor")}</p>
                      <p className="text-gray-500 text-sm">{t("confirmationPage.appointment.counselorDesc")}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 rounded-lg bg-white p-3 shadow-sm">
                      <CalendarCheck className="h-4 w-4 text-amber-600" />
                      <div>
                        <p className="text-gray-500 text-xs">{t("confirmationPage.appointment.date")}</p>
                        <p className="font-semibold text-gray-900 text-sm capitalize">
                          {new Date(appointment.date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white p-3 shadow-sm">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <div>
                        <p className="text-gray-500 text-xs">{t("confirmationPage.appointment.time")}</p>
                        <p className="font-semibold text-gray-900 text-sm">{appointment.timeSlot.time}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Budget card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    {t("confirmationPage.budget.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
                    <span className="text-gray-700">{t("confirmationPage.budget.yourBudget")}</span>
                    <span className="font-bold text-2xl text-green-700">${userBudget}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Services card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Package className="h-5 w-5" />
                    {t("confirmationPage.services.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{item.service?.nameFr}</p>
                          {item.variant && <p className="text-gray-500 text-xs">{item.variant.nameFr}</p>}
                        </div>
                        <span className="rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-700 text-xs">
                          {t("modeSelection.budget.quotePrice")}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-gray-200 border-t pt-4">
                    <p className="text-center text-gray-500 text-sm">
                      {items.length} {items.length > 1 ? t("confirmationPage.services.plural") : t("confirmationPage.services.singular")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Next steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="rounded-xl border border-blue-200 bg-blue-50 p-5"
            >
              <h3 className="mb-3 font-semibold text-blue-900">{t("confirmationPage.nextSteps.title")}</h3>
              <ul className="space-y-2">
                {[
                  t("confirmationPage.nextSteps.step1"),
                  t("confirmationPage.nextSteps.step2"),
                  t("confirmationPage.nextSteps.step3"),
                ].map((step, index) => (
                  <li key={step} className="flex items-start gap-3 text-blue-800 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 font-semibold text-blue-900 text-xs">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="pt-4"
            >
              <Button onClick={handleReturnHome} size="lg" className="w-full gap-2">
                <Home className="h-5 w-5" />
                {t("confirmationPage.returnHome")}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
