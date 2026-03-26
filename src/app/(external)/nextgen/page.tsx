"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Package2,
  X,
  Hash,
  Target,
  Globe,
  GraduationCap,
  Briefcase,
  Users,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServiceSelectionSection } from "@/features/services";
import { AppointmentStep } from "@/features/appointment";
import type { AppointmentData } from "@/features/appointment";
import { Logo } from "@/components/logo";
import Link from "next/link";

const objectives = [
  {
    id: "study",
    name: "Études",
    description: "Poursuivre mes études ou formations",
    icon: GraduationCap,
    color: "text-blue-500",
  },
  {
    id: "business",
    name: "Business",
    description: "Lancer ou développer mon entreprise",
    icon: Briefcase,
    color: "text-purple-500",
  },
  {
    id: "employment",
    name: "Emploi",
    description: "Trouver un emploi ou stage",
    icon: Users,
    color: "text-emerald-500",
  },
];

const popularCountries = [
  { id: "rdc", name: "RD Congo", flag: "🇨🇩" },
  { id: "france", name: "France", flag: "🇫🇷" },
  { id: "canada", name: "Canada", flag: "🇨🇦" },
  { id: "usa", name: "États-Unis", flag: "🇺🇸" },
  { id: "belgium", name: "Belgique", flag: "🇧🇪" },
  { id: "uk", name: "Royaume-Uni", flag: "🇬🇧" },
];

const steps = [
  { id: 1, title: "Âge", icon: Hash },
  { id: 2, title: "Objectif", icon: Target },
  { id: 3, title: "Destination", icon: Globe },
  { id: 4, title: "Services", icon: Package2 },
  { id: 5, title: "Rendez-vous", icon: Calendar },
];

export default function NextGen() {
  const router = useRouter();
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
      case 1:
        const ageNum = Number.parseInt(age);
        return age !== "" && ageNum >= 18 && ageNum <= 26;
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
    <div className="relative min-h-screen bg-linear-to-br from-amber-500/5 via-background to-background">
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
              <Link href="/">
                <X className="h-12 w-auto" strokeWidth={3} />
              </Link>
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold">
              Parcours NextGen
            </h1>
            <p className="text-muted-foreground mt-1">
              Propulsez vos ambitions en quelques étapes simples
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
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Quel est ton âge ?</h2>
                <p className="text-muted-foreground">
                  Ce parcours est conçu pour les 18-26 ans
                </p>
              </div>
              <Card className="max-w-md mx-auto p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary mt-1">
                      <Hash className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label htmlFor="age" className="text-base font-semibold">
                          Ton âge
                        </Label>
                        <p className="text-muted-foreground text-sm mt-1">
                          Entre 18 et 26 ans
                        </p>
                      </div>
                      <Input
                        id="age"
                        type="number"
                        min="18"
                        max="26"
                        placeholder="Ex: 22"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="max-w-xs text-lg"
                      />
                      {age && (Number.parseInt(age) < 18 || Number.parseInt(age) > 26) && (
                        <p className="text-destructive text-sm">
                          L'âge doit être entre 18 et 26 ans
                        </p>
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
                <h2 className="text-2xl font-bold mb-2">
                  Quel est ton objectif principal ?
                </h2>
                <p className="text-muted-foreground">
                  Choisis ce qui correspond le mieux à ton projet
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {objectives.map((objective) => {
                  const ObjectiveIcon = objective.icon;
                  return (
                    <Card
                      key={objective.id}
                      onClick={() => setSelectedObjective(objective.id)}
                      className={cn(
                        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                        selectedObjective === objective.id
                          ? "border-2 border-primary bg-primary/5"
                          : "border-2 border-transparent hover:border-primary/30",
                      )}
                    >
                      <CardHeader>
                        <div className="flex flex-col items-center text-center gap-3">
                          <div
                            className={cn(
                              "p-3 rounded-lg bg-primary/10",
                              objective.color,
                            )}
                          >
                            <ObjectiveIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg mb-1">
                              {objective.name}
                            </CardTitle>
                            <CardDescription>
                              {objective.description}
                            </CardDescription>
                          </div>
                          {selectedObjective === objective.id && (
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

          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Quel pays cibles-tu ?
                </h2>
                <p className="text-muted-foreground">
                  Sélectionne ta destination ou entre un autre pays
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {popularCountries.map((country) => (
                  <Card
                    key={country.id}
                    onClick={() => {
                      setSelectedCountry(country.name);
                      setCustomCountry("");
                    }}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                      selectedCountry === country.name
                        ? "border-2 border-primary bg-primary/5"
                        : "border-2 border-transparent hover:border-primary/30",
                    )}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{country.flag}</span>
                        <div className="flex-1">
                          <CardTitle className="text-base">
                            {country.name}
                          </CardTitle>
                        </div>
                        {selectedCountry === country.name && (
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
                          Autre pays
                        </Label>
                        <p className="text-muted-foreground text-sm mt-1">
                          Entre le nom du pays si tu ne le vois pas ci-dessus
                        </p>
                      </div>
                      <Input
                        id="custom-country"
                        placeholder="Ex: Allemagne, Japon..."
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
            {currentStep === 5 ? "Procéder au paiement" : "Suivant"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}