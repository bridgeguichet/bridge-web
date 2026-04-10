"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  Check,
  Coffee,
  DollarSign,
  Heart,
  Home,
  MapPin,
  Package2,
  Shield,
  Wallet,
  X,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppointmentData } from "@/features/appointment";
import { AppointmentStep } from "@/features/appointment";
import { ServiceSelectionSection } from "@/features/services";
import { useTranslation } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

const cityIds = ["kinshasa", "lubumbashi", "kolwezi", "matadi"];

const projectTypeConfigs = [
  { id: "preparationRetraite", icon: Coffee },
  { id: "installationRetraite", icon: Home },
  { id: "sejourRegulier", icon: MapPin },
  { id: "retourFamille", icon: Heart },
];

const pensionRangeIds = ["range1", "range2", "range3", "range4", "range5"];

const lifestyleConfigs = [
  { id: "standard", color: "text-blue-500", bgColor: "bg-blue-500" },
  { id: "residentiel", color: "text-emerald-500", bgColor: "bg-emerald-500" },
  { id: "premium", color: "text-purple-500", bgColor: "bg-purple-500" },
  { id: "ultraPremium", color: "text-amber-500", bgColor: "bg-amber-500" },
];

const stepConfigs = [
  { id: 1, key: "targetCity", icon: MapPin },
  { id: 2, key: "projectType", icon: Briefcase },
  { id: 3, key: "pension", icon: Wallet },
  { id: 4, key: "lifestyle", icon: Home },
  { id: 5, key: "healthFollowup", icon: Heart },
  { id: 6, key: "housing", icon: Shield },
  { id: 7, key: "services", icon: Package2 },
  { id: 8, key: "appointment", icon: Calendar },
];

export default function Retraite() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedPension, setSelectedPension] = useState<string>("");
  const [selectedLifestyle, setSelectedLifestyle] = useState<string>("");
  const [needsHealthFollowup, setNeedsHealthFollowup] = useState<boolean | null>(null);
  const [needsSecureHousing, setNeedsSecureHousing] = useState<boolean | null>(null);
  const [appointment, setAppointment] = useState<AppointmentData>({
    date: undefined,
    timeSlot: undefined,
  });

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log({
        city: selectedCity,
        project: selectedProject,
        pension: selectedPension,
        lifestyle: selectedLifestyle,
        healthFollowup: needsHealthFollowup,
        secureHousing: needsSecureHousing,
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
        return selectedCity !== "";
      case 2:
        return selectedProject !== "";
      case 3:
        return selectedPension !== "";
      case 4:
        return selectedLifestyle !== "";
      case 5:
        return needsHealthFollowup !== null;
      case 6:
        return needsSecureHousing !== null;
      case 7:
        return true;
      case 8:
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
              {t("retirementPage.title").split(" ")[0]}{" "}
              <span className="text-3xl md:text-4xl lg:text-5xl text-primary font-batangas">
                {t("retirementPage.title").split(" ")[1]}
              </span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">{t("retirementPage.subtitle")}</p>
          </div>

          <div className="md:hidden">
            <div className="w-full rounded-2xl border border-border/50 bg-background/80 p-4 shadow-lg backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <div className="text-sm font-semibold">{t("retirementPage.stepsLabel")}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("retirementPage.stepOf", { current: currentStep, total: stepConfigs.length })}
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
                        {t(`retirementPage.steps.${step.key}`)}
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
                <div className="text-sm font-semibold">{t("retirementPage.stepsLabel")}</div>
                <div className="text-xs text-muted-foreground">
                  {t("retirementPage.stepOf", { current: currentStep, total: stepConfigs.length })}
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
                        {t(`retirementPage.steps.${step.key}`)}
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
              {currentStep === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                      {t("retirementPage.step1.title")}
                    </h2>
                    <p className="text-muted-foreground text-sm">{t("retirementPage.step1.subtitle")}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {cityIds.map((cityId) => (
                      <Card
                        key={cityId}
                        onClick={() => setSelectedCity(cityId)}
                        className={cn(
                          "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                          selectedCity === cityId
                            ? "border-primary/60 bg-linear-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/30"
                            : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/5 hover:to-transparent backdrop-blur-sm",
                        )}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{t(`diasporaPage.cities.${cityId}.name`)}</CardTitle>
                              <CardDescription className="mt-1">
                                {t(`diasporaPage.cities.${cityId}.description`)}
                              </CardDescription>
                            </div>
                            {selectedCity === cityId && (
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

              {currentStep === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                      {t("retirementPage.step2.title")}
                    </h2>
                    <p className="text-muted-foreground text-sm">{t("retirementPage.step2.subtitle")}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {projectTypeConfigs.map((project) => {
                      const ProjectIcon = project.icon;
                      return (
                        <Card
                          key={project.id}
                          onClick={() => setSelectedProject(project.id)}
                          className={cn(
                            "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                            selectedProject === project.id
                              ? "border-primary/60 bg-linear-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/30"
                              : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/5 hover:to-transparent backdrop-blur-sm",
                          )}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="p-2 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                                  <ProjectIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-base">
                                    {t(`retirementPage.projectTypes.${project.id}.name`)}
                                  </CardTitle>
                                  <CardDescription className="mt-1">
                                    {t(`retirementPage.projectTypes.${project.id}.description`)}
                                  </CardDescription>
                                </div>
                              </div>
                              {selectedProject === project.id && (
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

              {currentStep === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                      {t("retirementPage.step3.title")}
                    </h2>
                    <p className="text-muted-foreground text-sm">{t("retirementPage.step3.subtitle")}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {pensionRangeIds.map((pensionId) => (
                      <Card
                        key={pensionId}
                        onClick={() => setSelectedPension(pensionId)}
                        className={cn(
                          "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                          selectedPension === pensionId
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
                              <CardTitle className="text-base">
                                {t(`retirementPage.pensionRanges.${pensionId}`)}
                              </CardTitle>
                            </div>
                            {selectedPension === pensionId && (
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

              {currentStep === 4 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                      {t("retirementPage.step4.title")}
                    </h2>
                    <p className="text-muted-foreground text-sm">{t("retirementPage.step4.subtitle")}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {lifestyleConfigs.map((lifestyle) => (
                      <Card
                        key={lifestyle.id}
                        onClick={() => setSelectedLifestyle(lifestyle.id)}
                        className={cn(
                          "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 relative overflow-hidden rounded-xl",
                          selectedLifestyle === lifestyle.id
                            ? "border-primary/60 bg-linear-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/30"
                            : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/5 hover:to-transparent backdrop-blur-sm",
                        )}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-base">
                                  {t(`diasporaPage.lifestyles.${lifestyle.id}.name`)}
                                </CardTitle>
                                {lifestyle.id === "ultraPremium" && (
                                  <Badge variant="secondary" className="text-xs">
                                    {t("diasporaPage.lifestyles.ultraPremium.badge")}
                                  </Badge>
                                )}
                              </div>
                              <CardDescription>
                                {t(`diasporaPage.lifestyles.${lifestyle.id}.description`)}
                              </CardDescription>
                            </div>
                            {selectedLifestyle === lifestyle.id && (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <div
                          className={cn(
                            "absolute bottom-0 left-0 right-0 h-1.5 transition-all duration-300",
                            selectedLifestyle === lifestyle.id
                              ? `${lifestyle.bgColor} shadow-lg shadow-${lifestyle.bgColor}/50`
                              : "bg-transparent group-hover:bg-linear-to-r group-hover:from-primary/20 group-hover:via-primary/40 group-hover:to-primary/20",
                          )}
                        />
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                      {t("retirementPage.step5.title")}
                    </h2>
                    <p className="text-muted-foreground text-sm">{t("retirementPage.step5.subtitle")}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <Card
                      onClick={() => setNeedsHealthFollowup(true)}
                      className={cn(
                        "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                        needsHealthFollowup === true
                          ? "border-primary/60 bg-linear-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/30"
                          : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/5 hover:to-transparent backdrop-blur-sm",
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                              <Heart className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base">{t("retirementPage.step5.yes")}</CardTitle>
                              <CardDescription className="mt-1">
                                {t("retirementPage.step5.yesDescription")}
                              </CardDescription>
                            </div>
                          </div>
                          {needsHealthFollowup === true && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                    </Card>

                    <Card
                      onClick={() => setNeedsHealthFollowup(false)}
                      className={cn(
                        "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                        needsHealthFollowup === false
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
                              <CardTitle className="text-base">{t("retirementPage.step5.no")}</CardTitle>
                              <CardDescription className="mt-1">
                                {t("retirementPage.step5.noDescription")}
                              </CardDescription>
                            </div>
                          </div>
                          {needsHealthFollowup === false && (
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

              {currentStep === 6 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                      {t("retirementPage.step6.title")}
                    </h2>
                    <p className="text-muted-foreground text-sm">{t("retirementPage.step6.subtitle")}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <Card
                      onClick={() => setNeedsSecureHousing(true)}
                      className={cn(
                        "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                        needsSecureHousing === true
                          ? "border-primary/60 bg-linear-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/30"
                          : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/5 hover:to-transparent backdrop-blur-sm",
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                              <Home className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base">{t("retirementPage.step6.yes")}</CardTitle>
                              <CardDescription className="mt-1">
                                {t("retirementPage.step6.yesDescription")}
                              </CardDescription>
                            </div>
                          </div>
                          {needsSecureHousing === true && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                    </Card>

                    <Card
                      onClick={() => setNeedsSecureHousing(false)}
                      className={cn(
                        "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                        needsSecureHousing === false
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
                              <CardTitle className="text-base">{t("retirementPage.step6.no")}</CardTitle>
                              <CardDescription className="mt-1">
                                {t("retirementPage.step6.noDescription")}
                              </CardDescription>
                            </div>
                          </div>
                          {needsSecureHousing === false && (
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

              {currentStep === 7 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <ServiceSelectionSection userProfile="retraite" />
                </div>
              )}

              {currentStep === 8 && (
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
                {t("retirementPage.navigation.previous")}
              </Button>

              <Button
                size="lg"
                onClick={handleNext}
                disabled={!isStepComplete()}
                className="gap-2 hover:scale-105 transition-transform duration-200 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl"
              >
                {currentStep === 8 ? t("retirementPage.navigation.finish") : t("retirementPage.navigation.next")}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
