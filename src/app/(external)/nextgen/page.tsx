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
  Globe,
  GraduationCap,
  Hash,
  Package2,
  Target,
  Users,
  X,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AppointmentData } from "@/features/appointment";
import { AppointmentStep } from "@/features/appointment";
import { ServiceSelectionSection } from "@/features/services";
import { useTranslation } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

const objectiveConfigs = [
  { id: "study", icon: GraduationCap, color: "text-blue-500" },
  { id: "business", icon: Briefcase, color: "text-purple-500" },
  { id: "employment", icon: Users, color: "text-emerald-500" },
];

const popularCountryConfigs = [
  { id: "rdc", flag: "🇨🇩" },
  { id: "france", flag: "🇫🇷" },
  { id: "canada", flag: "🇨🇦" },
  { id: "usa", flag: "🇺🇸" },
  { id: "belgium", flag: "🇧🇪" },
  { id: "uk", flag: "🇬🇧" },
];

const stepConfigs = [
  { id: 1, key: "age", icon: Hash },
  { id: 2, key: "objective", icon: Target },
  { id: 3, key: "destination", icon: Globe },
  { id: 4, key: "services", icon: Package2 },
  { id: 5, key: "appointment", icon: Calendar },
];

export default function NextGen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [age, setAge] = useState<string>("");
  const [selectedObjective, setSelectedObjective] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [customCountry, setCustomCountry] = useState<string>("");
  const [appointment, setAppointment] = useState<AppointmentData>({
    date: undefined,
    timeSlot: undefined,
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log({
        age,
        objective: selectedObjective,
        country: selectedCountry || customCountry,
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
      case 1: {
        const ageNum = Number.parseInt(age);
        return age !== "" && ageNum >= 18 && ageNum <= 26;
      }
      case 2:
        return selectedObjective !== "";
      case 3:
        return selectedCountry !== "" || customCountry.trim() !== "";
      case 4:
        return true;
      case 5:
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
              {t("nextgenPage.title").split(" ")[0]}{" "}
              <span className="text-3xl md:text-4xl lg:text-5xl text-primary font-batangas">
                {t("nextgenPage.title").split(" ")[1]}
              </span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">{t("nextgenPage.subtitle")}</p>
          </div>

          <div className="md:hidden">
            <div className="w-full rounded-2xl border border-border/50 bg-background/80 p-4 shadow-lg backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <div className="text-sm font-semibold">{t("nextgenPage.stepsLabel")}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("nextgenPage.stepOf", { current: currentStep, total: stepConfigs.length })}
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
                        {t(`nextgenPage.steps.${step.key}`)}
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
                <div className="text-sm font-semibold">{t("nextgenPage.stepsLabel")}</div>
                <div className="text-xs text-muted-foreground">
                  {t("nextgenPage.stepOf", { current: currentStep, total: stepConfigs.length })}
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
                        {t(`nextgenPage.steps.${step.key}`)}
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
                      {t("nextgenPage.step1.title")}
                    </h2>
                    <p className="text-muted-foreground text-sm">{t("nextgenPage.step1.subtitle")}</p>
                  </div>
                  <Card className="max-w-md mx-auto p-6 border-border/50 bg-background/50 backdrop-blur-sm rounded-xl">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 text-primary mt-1">
                          <Hash className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label htmlFor="age" className="text-base font-semibold">
                              {t("nextgenPage.step1.ageLabel")}
                            </Label>
                            <p className="text-muted-foreground text-sm mt-1">{t("nextgenPage.step1.ageHelp")}</p>
                          </div>
                          <Input
                            id="age"
                            type="number"
                            min="18"
                            max="26"
                            placeholder={t("nextgenPage.step1.agePlaceholder")}
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="max-w-xs text-lg"
                          />
                          {age && (Number.parseInt(age) < 18 || Number.parseInt(age) > 26) && (
                            <p className="text-destructive text-sm">{t("nextgenPage.step1.ageError")}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {currentStep === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                      {t("nextgenPage.step2.title")}
                    </h2>
                    <p className="text-muted-foreground text-sm">{t("nextgenPage.step2.subtitle")}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {objectiveConfigs.map((objective) => {
                      const ObjectiveIcon = objective.icon;
                      return (
                        <Card
                          key={objective.id}
                          onClick={() => setSelectedObjective(objective.id)}
                          className={cn(
                            "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                            selectedObjective === objective.id
                              ? "border-primary/60 bg-linear-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/30"
                              : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/5 hover:to-transparent backdrop-blur-sm",
                          )}
                        >
                          <CardHeader>
                            <div className="flex flex-col items-center text-center gap-3">
                              <div
                                className={cn(
                                  "p-3 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-transform duration-300",
                                  objective.color,
                                )}
                              >
                                <ObjectiveIcon className="w-6 h-6" />
                              </div>
                              <div>
                                <CardTitle className="text-base mb-1">
                                  {t(`nextgenPage.objectives.${objective.id}.name`)}
                                </CardTitle>
                                <CardDescription>
                                  {t(`nextgenPage.objectives.${objective.id}.description`)}
                                </CardDescription>
                              </div>
                              {selectedObjective === objective.id && (
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

              {currentStep === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                      {t("nextgenPage.step3.title")}
                    </h2>
                    <p className="text-muted-foreground text-sm">{t("nextgenPage.step3.subtitle")}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {popularCountryConfigs.map((country) => (
                      <Card
                        key={country.id}
                        onClick={() => {
                          setSelectedCountry(country.id);
                          setCustomCountry("");
                        }}
                        className={cn(
                          "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                          selectedCountry === country.id
                            ? "border-primary/60 bg-linear-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/30"
                            : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/5 hover:to-transparent backdrop-blur-sm",
                        )}
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{country.flag}</span>
                            <div className="flex-1">
                              <CardTitle className="text-base">
                                {t(`nextgenPage.popularCountries.${country.id}`)}
                              </CardTitle>
                            </div>
                            {selectedCountry === country.id && (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>

                  <Card className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary mt-1">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label htmlFor="custom-country" className="text-base font-semibold">
                              {t("nextgenPage.step3.otherCountryLabel")}
                            </Label>
                            <p className="text-muted-foreground text-sm mt-1">
                              {t("nextgenPage.step3.otherCountryHelp")}
                            </p>
                          </div>
                          <Input
                            id="custom-country"
                            placeholder={t("nextgenPage.step3.otherCountryPlaceholder")}
                            value={customCountry}
                            onChange={(e) => {
                              setCustomCountry(e.target.value);
                              setSelectedCountry("");
                            }}
                            className="max-w-md"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {currentStep === 4 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <ServiceSelectionSection userProfile="nextgen" />
                </div>
              )}

              {currentStep === 5 && (
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
                {t("nextgenPage.navigation.previous")}
              </Button>

              <Button
                size="lg"
                onClick={handleNext}
                disabled={!isStepComplete()}
                className="gap-2 hover:scale-105 transition-transform duration-200 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl"
              >
                {currentStep === 5 ? t("nextgenPage.navigation.finish") : t("nextgenPage.navigation.next")}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
