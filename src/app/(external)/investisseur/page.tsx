"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Check,
  Package2,
  X,
  TrendingUp,
  Clock,
  Building2,
  Factory,
  Landmark,
  Home,
  Truck,
  Cpu,
  Sprout,
  ShoppingBag,
  HelpCircle,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceSelectionSection } from "@/features/services";
import { AppointmentStep } from "@/features/appointment";
import type { AppointmentData } from "@/features/appointment";
import { Logo } from "@/components/logo";
import Link from "next/link";

const investmentBudgets = [
  { id: "small", label: "10 000$ - 50 000$", value: "10000-50000", description: "Petit investissement" },
  { id: "medium", label: "50 000$ - 200 000$", value: "50000-200000", description: "Investissement moyen" },
  { id: "large", label: "200 000$ - 1M$", value: "200000-1000000", description: "Grand investissement" },
  { id: "very-large", label: "Plus de 1M$", value: "1000000+", description: "Investissement majeur" },
];

const investmentSectors = [
  {
    id: "immobilier",
    name: "Immobilier",
    description: "Résidentiel, commercial, terrain",
    icon: Home,
    color: "text-blue-500",
  },
  {
    id: "agriculture",
    name: "Agriculture",
    description: "Agrobusiness, transformation",
    icon: Sprout,
    color: "text-green-500",
  },
  {
    id: "tech",
    name: "Tech & Digital",
    description: "Startups, services numériques",
    icon: Cpu,
    color: "text-purple-500",
  },
  {
    id: "logistique",
    name: "Logistique",
    description: "Transport, distribution",
    icon: Truck,
    color: "text-orange-500",
  },
  {
    id: "industrie",
    name: "Industrie",
    description: "Manufacturing, production",
    icon: Factory,
    color: "text-slate-500",
  },
  {
    id: "commerce",
    name: "Commerce",
    description: "Retail, import-export",
    icon: ShoppingBag,
    color: "text-rose-500",
  },
  {
    id: "finance",
    name: "Finance",
    description: "Services financiers, fintech",
    icon: Landmark,
    color: "text-emerald-500",
  },
  {
    id: "autre",
    name: "Autre secteur",
    description: "Opportunité spécifique",
    icon: HelpCircle,
    color: "text-amber-500",
  },
];

const investmentHorizons = [
  {
    id: "court-terme",
    name: "Court terme",
    description: "Moins de 2 ans - Retour rapide",
    icon: Clock,
    color: "text-blue-500",
  },
  {
    id: "long-terme",
    name: "Long terme",
    description: "Plus de 2 ans - Croissance durable",
    icon: TrendingUp,
    color: "text-emerald-500",
  },
];

const steps = [
  { id: 1, title: "Budget", icon: DollarSign },
  { id: 2, title: "Secteur", icon: Building2 },
  { id: 3, title: "Horizon", icon: Clock },
  { id: 4, title: "Financement", icon: Landmark },
  { id: 5, title: "Services", icon: Package2 },
  { id: 6, title: "Rendez-vous", icon: Calendar },
];

export default function Investisseur() {
  const router = useRouter();
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
    <div className="relative min-h-screen bg-linear-to-br from-purple-500/5 via-background to-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Logo className="h-13 w-auto" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-13 w-13 text-muted-foreground hover:bg-primary hover:text-white"
              aria-label="Quitter"
            >
              <Link href="/"><X className="h-12 w-auto" strokeWidth={3} /></Link>
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold">
              Parcours Investisseur
            </h1>
            <p className="text-muted-foreground mt-1">
              Structurez votre projet d'investissement en quelques étapes
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 mb-8 pt-2 pl-2">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                        isActive &&
                          "bg-primary text-primary-foreground border-primary scale-110",
                        isCompleted &&
                          "bg-primary/20 text-primary border-primary",
                        !isActive &&
                          !isCompleted &&
                          "bg-muted text-muted-foreground border-border",
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs mt-2 text-center font-medium hidden sm:block",
                        isActive && "text-primary",
                        isCompleted && "text-primary",
                        !isActive && !isCompleted && "text-muted-foreground",
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 transition-all duration-300 mx-2",
                        isCompleted ? "bg-primary" : "bg-border",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="min-h-[400px] mb-8">
          {/* Step 1: Investment Budget */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Quel est votre budget d'investissement ?
                </h2>
                <p className="text-muted-foreground">
                  Sélectionnez la fourchette qui correspond à votre capacité d'investissement
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investmentBudgets.map((budget) => (
                  <Card
                    key={budget.id}
                    onClick={() => setSelectedBudget(budget.value)}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                      selectedBudget === budget.value
                        ? "border-2 border-primary bg-primary/5"
                        : "border-2 border-transparent hover:border-primary/30",
                    )}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <DollarSign className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {budget.label}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {budget.description}
                            </CardDescription>
                          </div>
                        </div>
                        {selectedBudget === budget.value && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
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
                <h2 className="text-2xl font-bold mb-2">
                  Dans quel secteur souhaitez-vous investir ?
                </h2>
                <p className="text-muted-foreground">
                  Choisissez le domaine d'activité qui vous intéresse
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investmentSectors.map((sector) => {
                  const SectorIcon = sector.icon;
                  return (
                    <Card
                      key={sector.id}
                      onClick={() => setSelectedSector(sector.id)}
                      className={cn(
                        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                        selectedSector === sector.id
                          ? "border-2 border-primary bg-primary/5"
                          : "border-2 border-transparent hover:border-primary/30",
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={cn("p-2 rounded-lg bg-primary/10", sector.color)}>
                              <SectorIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                {sector.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {sector.description}
                              </CardDescription>
                            </div>
                          </div>
                          {selectedSector === sector.id && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                              <Check className="w-4 h-4 text-primary-foreground" />
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
                <h2 className="text-2xl font-bold mb-2">
                  Quel est votre horizon d'investissement ?
                </h2>
                <p className="text-muted-foreground">
                  Définissez la durée prévue de votre investissement
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investmentHorizons.map((horizon) => {
                  const HorizonIcon = horizon.icon;
                  return (
                    <Card
                      key={horizon.id}
                      onClick={() => setSelectedHorizon(horizon.id)}
                      className={cn(
                        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                        selectedHorizon === horizon.id
                          ? "border-2 border-primary bg-primary/5"
                          : "border-2 border-transparent hover:border-primary/30",
                      )}
                    >
                      <CardHeader>
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className={cn("p-3 rounded-lg bg-primary/10", horizon.color)}>
                            <HorizonIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg mb-1">
                              {horizon.name}
                            </CardTitle>
                            <CardDescription>
                              {horizon.description}
                            </CardDescription>
                          </div>
                          {selectedHorizon === horizon.id && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-foreground" />
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
                <h2 className="text-2xl font-bold mb-2">
                  Recherchez-vous un financement ?
                </h2>
                <p className="text-muted-foreground">
                  Avez-vous besoin d'aide pour structurer ou obtenir un financement ?
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  onClick={() => setNeedsFinancing(true)}
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                    needsFinancing === true
                      ? "border-2 border-primary bg-primary/5"
                      : "border-2 border-transparent hover:border-primary/30",
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                          <Landmark className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">Oui</CardTitle>
                          <CardDescription className="mt-1">
                            J'ai besoin d'accompagnement pour le financement
                          </CardDescription>
                        </div>
                      </div>
                      {needsFinancing === true && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </Card>

                <Card
                  onClick={() => setNeedsFinancing(false)}
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                    needsFinancing === false
                      ? "border-2 border-primary bg-primary/5"
                      : "border-2 border-transparent hover:border-primary/30",
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-muted">
                          <X className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">Non</CardTitle>
                          <CardDescription className="mt-1">
                            Mon financement est déjà sécurisé
                          </CardDescription>
                        </div>
                      </div>
                      {needsFinancing === false && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-4 h-4 text-primary-foreground" />
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
              <AppointmentStep
                onAppointmentChange={setAppointment}
                selectedServicesCount={0}
                totalEstimate={0}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 pt-6 border-t mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="gap-2"
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="gap-2"
          >
            {currentStep === 6 ? "Procéder au paiement" : "Suivant"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}