"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  Clock,
  Cpu,
  DollarSign,
  Factory,
  HelpCircle,
  Home,
  Landmark,
  Package2,
  ShoppingBag,
  Sprout,
  TrendingUp,
  Truck,
  X,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppointmentData } from "@/features/appointment";
import { AppointmentStep } from "@/features/appointment";
import { ServiceSelectionSection } from "@/features/services";
import { useTranslation } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

const investmentBudgetIds = ["small", "medium", "large", "veryLarge"];

const investmentSectorConfigs = [
  { id: "immobilier", icon: Home, color: "text-blue-500" },
  { id: "agriculture", icon: Sprout, color: "text-green-500" },
  { id: "tech", icon: Cpu, color: "text-purple-500" },
  { id: "logistique", icon: Truck, color: "text-orange-500" },
  { id: "industrie", icon: Factory, color: "text-slate-500" },
  { id: "commerce", icon: ShoppingBag, color: "text-rose-500" },
  { id: "finance", icon: Landmark, color: "text-emerald-500" },
  { id: "autre", icon: HelpCircle, color: "text-amber-500" },
];

const investmentHorizonConfigs = [
  { id: "courtTerme", icon: Clock, color: "text-blue-500" },
  { id: "longTerme", icon: TrendingUp, color: "text-emerald-500" },
];

const stepConfigs = [
  { id: 1, key: "budget", icon: DollarSign },
  { id: 2, key: "sector", icon: Building2 },
  { id: 3, key: "horizon", icon: Clock },
  { id: 4, key: "financing", icon: Landmark },
  { id: 5, key: "services", icon: Package2 },
  { id: 6, key: "appointment", icon: Calendar },
];

export default function Investisseur() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedHorizon, setSelectedHorizon] = useState<string>("");
  const [needsFinancing, setNeedsFinancing] = useState<boolean | null>(null);
  const [appointment, setAppointment] = useState<AppointmentData>({
    date: undefined,
    timeSlot: undefined,
  });

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log({
        budget: selectedBudget,
        sector: selectedSector,
        horizon: selectedHorizon,
        needsFinancing,
        appointment: appointment,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return selectedBudget !== "";
      case 2:
        return selectedSector !== "";
      case 3:
        return selectedHorizon !== "";
      case 4:
        return needsFinancing !== null;
      case 5:
        return true;
      case 6:
        return appointment.date !== undefined && appointment.timeSlot !== undefined;
      default:
        return false;
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-blue-50/50 via-background to-purple-50/30 dark:from-blue-950/20 dark:via-background dark:to-purple-950/10">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Logo className="h-11 w-auto" />
            </div>
            <Link href="/">
              <Button
                variant="ghost"
                size="icon-lg"
                className="h-10 w-10 rounded-xl text-muted-foreground hover:text-white hover:bg-linear-to-br hover:from-red-500 hover:to-red-600 hover:scale-110 hover:rotate-90 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 group"
                aria-label="Quitter"
              >
                <X className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
              </Button>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-linear-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {t("investorPage.title").split(" ")[0]}{" "}
              <span className="text-3xl md:text-4xl lg:text-5xl text-primary font-batangas">
                {t("investorPage.title").split(" ")[1]}
              </span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">{t("investorPage.subtitle")}</p>
          </div>

          <div className="md:hidden">
            <div className="w-full rounded-2xl border border-border/50 bg-background/80 p-4 shadow-lg backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <div className="text-sm font-semibold">{t("investorPage.stepsLabel")}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("investorPage.stepOf", { current: currentStep, total: stepConfigs.length })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 overflow-x-auto py-2">
                {stepConfigs.map((step) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <div key={step.id} className="shrink-0">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 mx-auto",
                          isActive && "bg-primary text-primary-foreground border-primary scale-105",
                          isCompleted && "bg-primary/20 text-primary border-primary",
                          !isActive && !isCompleted && "bg-muted text-muted-foreground border-border",
                        )}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                      </div>
                      <div
                        className={cn(
                          "text-[11px] mt-2 text-center font-medium whitespace-nowrap",
                          isActive && "text-primary",
                          isCompleted && "text-primary",
                          !isActive && !isCompleted && "text-muted-foreground",
                        )}
                      >
                        {t(`investorPage.steps.${step.key}`)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row md:gap-6">
          <div className="shrink-0 md:sticky md:top-8 hidden md:block md:w-[180px]">
            <div className="w-full rounded-2xl border border-border/50 bg-background/80 p-4 shadow-lg backdrop-blur-xl md:w-[180px]">
              <div className="mb-3">
                <div className="text-sm font-semibold">{t("investorPage.stepsLabel")}</div>
                <div className="text-xs text-muted-foreground">
                  {t("investorPage.stepOf", { current: currentStep, total: stepConfigs.length })}
                </div>
              </div>

              <div className="flex flex-col items-center">
                {stepConfigs.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                          isActive && "bg-primary text-primary-foreground border-primary scale-110",
                          isCompleted && "bg-primary/20 text-primary border-primary",
                          !isActive && !isCompleted && "bg-muted text-muted-foreground border-border",
                        )}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                      </div>
                      <span
                        className={cn(
                          "text-xs mt-2 text-center font-medium hidden sm:block max-w-22",
                          isActive && "text-primary",
                          isCompleted && "text-primary",
                          !isActive && !isCompleted && "text-muted-foreground",
                        )}
                      >
                        {t(`investorPage.steps.${step.key}`)}
                      </span>
                      {index < stepConfigs.length - 1 && (
                        <div
                          className={cn(
                            "w-0.5 h-8 transition-all duration-300 my-2 rounded-full",
                            isCompleted ? "bg-primary" : "bg-border",
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="min-h-[280px] mb-6">
              {/* Step 1: Investment Budget */}
              {currentStep === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                      {t("investorPage.step1.title")}
                    </h2>
                    <p className="text-muted-foreground text-sm">{t("investorPage.step1.subtitle")}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {investmentBudgetIds.map((budgetId) => (
                      <Card
                        key={budgetId}
                        onClick={() => setSelectedBudget(budgetId)}
                        className={cn(
                          "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                          selectedBudget === budgetId
                            ? "border-primary/60 bg-linear-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/30"
                            : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/5 hover:to-transparent backdrop-blur-sm",
                        )}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                                <DollarSign className="w-4 h-4" />
                              </div>
                              <div>
                                <CardTitle className="text-base">
                                  {t(`investorPage.investmentBudgets.${budgetId}.label`)}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  {t(`investorPage.investmentBudgets.${budgetId}.description`)}
                                </CardDescription>
                              </div>
                            </div>
                            {selectedBudget === budgetId && (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Target Sector */}
              {currentStep === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                      {t("investorPage.step2.title")}
                    </h2>
                    <p className="text-muted-foreground text-sm">{t("investorPage.step2.subtitle")}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {investmentSectorConfigs.map((sector) => {
                      const SectorIcon = sector.icon;
                      return (
                        <Card
                          key={sector.id}
                          onClick={() => setSelectedSector(sector.id)}
                          className={cn(
                            "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                            selectedSector === sector.id
                              ? "border-primary/60 bg-linear-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/30"
                              : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/5 hover:to-transparent backdrop-blur-sm",
                          )}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div
                                  className={cn(
                                    "p-2 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-transform duration-300",
                                    sector.color,
                                  )}
                                >
                                  <SectorIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-base">
                                    {t(`investorPage.investmentSectors.${sector.id}.name`)}
                                  </CardTitle>
                                  <CardDescription className="mt-1">
                                    {t(`investorPage.investmentSectors.${sector.id}.description`)}
                                  </CardDescription>
                                </div>
                              </div>
                              {selectedSector === sector.id && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                                  <Check className="w-3 h-3 text-primary-foreground" />
                                </div>
                              )}
                            </div>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Investment Horizon */}
              {currentStep === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                      {t("investorPage.step3.title")}
                    </h2>
                    <p className="text-muted-foreground text-sm">{t("investorPage.step3.subtitle")}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {investmentHorizonConfigs.map((horizon) => {
                      const HorizonIcon = horizon.icon;
                      return (
                        <Card
                          key={horizon.id}
                          onClick={() => setSelectedHorizon(horizon.id)}
                          className={cn(
                            "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                            selectedHorizon === horizon.id
                              ? "border-primary/60 bg-linear-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/30"
                              : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/5 hover:to-transparent backdrop-blur-sm",
                          )}
                        >
                          <CardHeader>
                            <div className="flex flex-col items-center text-center gap-3">
                              <div
                                className={cn(
                                  "p-3 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-transform duration-300",
                                  horizon.color,
                                )}
                              >
                                <HorizonIcon className="w-6 h-6" />
                              </div>
                              <div>
                                <CardTitle className="text-base mb-1">
                                  {t(`investorPage.investmentHorizons.${horizon.id}.name`)}
                                </CardTitle>
                                <CardDescription>
                                  {t(`investorPage.investmentHorizons.${horizon.id}.description`)}
                                </CardDescription>
                              </div>
                              {selectedHorizon === horizon.id && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                  <Check className="w-3 h-3 text-primary-foreground" />
                                </div>
                              )}
                            </div>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Financing Need */}
              {currentStep === 4 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                      {t("investorPage.step4.title")}
                    </h2>
                    <p className="text-muted-foreground text-sm">{t("investorPage.step4.subtitle")}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <Card
                      onClick={() => setNeedsFinancing(true)}
                      className={cn(
                        "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                        needsFinancing === true
                          ? "border-primary/60 bg-linear-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/30"
                          : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/5 hover:to-transparent backdrop-blur-sm",
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                              <Landmark className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base">{t("investorPage.step4.yes")}</CardTitle>
                              <CardDescription className="mt-1">
                                {t("investorPage.step4.yesDescription")}
                              </CardDescription>
                            </div>
                          </div>
                          {needsFinancing === true && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                    </Card>

                    <Card
                      onClick={() => setNeedsFinancing(false)}
                      className={cn(
                        "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                        needsFinancing === false
                          ? "border-primary/60 bg-linear-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/30"
                          : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/5 hover:to-transparent backdrop-blur-sm",
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 rounded-xl bg-muted group-hover:scale-110 transition-transform duration-300">
                              <X className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base">{t("investorPage.step4.no")}</CardTitle>
                              <CardDescription className="mt-1">
                                {t("investorPage.step4.noDescription")}
                              </CardDescription>
                            </div>
                          </div>
                          {needsFinancing === false && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 5: Services Selection */}
              {currentStep === 5 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <ServiceSelectionSection userProfile="investissement" />
                </div>
              )}

              {/* Step 6: Appointment Booking */}
              {currentStep === 6 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <AppointmentStep onAppointmentChange={setAppointment} selectedServicesCount={0} totalEstimate={0} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 pt-5 border-t border-border/50 mt-6">
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                className="gap-2 hover:scale-105 transition-transform duration-200"
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4" />
                {t("investorPage.navigation.previous")}
              </Button>

              <Button
                size="lg"
                onClick={handleNext}
                disabled={!isStepComplete()}
                className="gap-2 hover:scale-105 transition-transform duration-200 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl"
              >
                {currentStep === 6 ? t("investorPage.navigation.finish") : t("investorPage.navigation.next")}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
