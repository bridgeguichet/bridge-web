"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calculator, DollarSign, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePackBuilderStore } from "@/features/pack-builder/store";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function BudgetPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const items = usePackBuilderStore((state) => state.items);
  const pricingMode = usePackBuilderStore((state) => state.pricingMode);
  const userBudget = usePackBuilderStore((state) => state.userBudget);
  const setUserBudget = usePackBuilderStore((state) => state.setUserBudget);

  const [budgetInput, setBudgetInput] = useState<string>(userBudget?.toString() || "");

  useEffect(() => {
    if (pricingMode !== "budget") {
      router.push("/monpack/mode");
      return;
    }
    if (items.length === 0) {
      router.push("/monpack");
    }
  }, [pricingMode, items.length, router]);

  const handleBudgetChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setBudgetInput(numericValue);
  };

  const handleContinue = () => {
    const budget = Number.parseInt(budgetInput, 10);
    if (budget > 0) {
      setUserBudget(budget);
      router.push("/monpack/conseiller");
    }
  };

  const isValidBudget = Number.parseInt(budgetInput, 10) > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-gray-200 border-b bg-white">
        <div className="container mx-auto px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <Button onClick={() => router.push("/monpack")} variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("common.back")}
            </Button>
            <h1 className="font-bold text-xl text-gray-900">{t("monpackSection.title")}</h1>
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
              <span className="hidden sm:inline">{t("budgetPage.steps.services")}</span>
            </div>
            <div className="h-px w-8 bg-gray-300" />
            <div className="flex items-center gap-2 text-sm text-primary">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-semibold text-white text-xs">
                2
              </div>
              <span className="hidden font-medium sm:inline">{t("budgetPage.steps.budget")}</span>
            </div>
            <div className="h-px w-8 bg-gray-300" />
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-300 font-semibold text-xs">
                3
              </div>
              <span className="hidden sm:inline">{t("budgetPage.steps.appointment")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                <Calculator className="h-7 w-7 text-amber-600" />
              </div>
            </div>
            <h2 className="font-bold text-2xl text-gray-900 sm:text-3xl">{t("budgetPage.title")}</h2>
            <p className="mt-3 text-gray-500">{t("budgetPage.description")}</p>
          </motion.div>

          {/* Services summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-5 w-5" />
                  {t("budgetPage.selectedServices")}
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
                    {items.length}{" "}
                    {items.length > 1 ? t("budgetPage.servicesPlural") : t("budgetPage.servicesSingular")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Budget input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                  {t("budgetPage.budgetInput.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">{t("budgetPage.budgetInput.description")}</p>
                <div className="space-y-2">
                  <Label htmlFor="budget">{t("budgetPage.budgetInput.label")}</Label>
                  <div className="relative">
                    <span className="absolute top-1/2 left-4 -translate-y-1/2 font-semibold text-gray-500">$</span>
                    <Input
                      id="budget"
                      type="text"
                      inputMode="numeric"
                      placeholder="1000"
                      value={budgetInput}
                      onChange={(e) => handleBudgetChange(e.target.value)}
                      className="h-14 pl-10 font-semibold text-2xl"
                    />
                  </div>
                  <p className="text-gray-500 text-xs">{t("budgetPage.budgetInput.hint")}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-xl border border-blue-200 bg-blue-50 p-4"
          >
            <p className="text-blue-800 text-sm">
              <strong>{t("budgetPage.info.title")}</strong> {t("budgetPage.info.description")}
            </p>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between border-gray-200 border-t pt-6">
            <Button onClick={() => router.push("/monpack")} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("common.back")}
            </Button>

            <Button onClick={handleContinue} disabled={!isValidBudget} className="gap-2">
              {t("budgetPage.continue")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
