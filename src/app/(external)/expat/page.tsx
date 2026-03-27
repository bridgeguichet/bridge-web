"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Home,
  ArrowRight,
  ArrowLeft,
  Check,
  Plane,
  Package2,
  X,
  Clock,
  Building2,
  FileCheck,
  Landmark,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServiceSelectionSection } from "@/features/services";
import { AppointmentStep } from "@/features/appointment";
import type { AppointmentData } from "@/features/appointment";
import { Logo } from "@/components/logo";
import Link from "next/link";

const cities = [
  { id: "kinshasa", name: "Kinshasa", description: "Capitale dynamique" },
  { id: "lubumbashi", name: "Lubumbashi", description: "Capitale minière" },
  { id: "kolwezi", name: "Kolwezi", description: "Pôle industriel" },
  { id: "matadi", name: "Matadi", description: "Ville portuaire" },
];

const projectTypes = [
  {
    id: "court-sejour",
    name: "Court séjour",
    description: "Visite temporaire de quelques semaines",
    icon: Plane,
  },
  {
    id: "installation",
    name: "Installation définitive",
    description: "S'installer durablement au Congo",
    icon: Home,
  },
  {
    id: "investissement",
    name: "Investissement",
    description: "Développer un projet d'affaires",
    icon: Briefcase,
  },
  {
    id: "exploration",
    name: "Exploration",
    description: "Découvrir les opportunités",
    icon: MapPin,
  },
];

const budgetRanges = [
  { id: "500-1500", label: "500$ - 1 500$", value: "500-1500" },
  { id: "1500-3000", label: "1 500$ - 3 000$", value: "1500-3000" },
  { id: "3000-6000", label: "3 000$ - 6 000$", value: "3000-6000" },
  { id: "6000-10000", label: "6 000$ - 10 000$", value: "6000-10000" },
  { id: "10000-15000", label: "10 000$ - 15 000$", value: "10000-15000" },
];

const lifestyles = [
  {
    id: "standard",
    name: "Standard",
    description: "Confort essentiel et fonctionnel",
    color: "text-blue-500",
    bgColor: "bg-blue-500",
  },
  {
    id: "residentiel",
    name: "Résidentiel sécurisé",
    description: "Quartiers sécurisés avec commodités",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Haut standing et services exclusifs",
    color: "text-purple-500",
    bgColor: "bg-purple-500",
  },
  {
    id: "ultra-premium",
    name: "Ultra Premium",
    description: "Luxe absolu et prestations sur-mesure",
    color: "text-amber-500",
    bgColor: "bg-amber-500",
  },
];

const missionDurations = [
  {
    id: "court-terme",
    name: "Court terme",
    description: "Moins de 6 mois",
    icon: Clock,
    color: "text-blue-500",
  },
  {
    id: "moyen-terme",
    name: "Moyen terme",
    description: "6 mois à 2 ans",
    icon: Clock,
    color: "text-emerald-500",
  },
  {
    id: "long-terme",
    name: "Long terme",
    description: "Plus de 2 ans",
    icon: Clock,
    color: "text-purple-500",
  },
];

const steps = [
  { id: 1, title: "Ville cible", icon: MapPin },
  { id: 2, title: "Type de projet", icon: Briefcase },
  { id: 3, title: "Budget mensuel", icon: DollarSign },
  { id: 4, title: "Niveau de vie", icon: Home },
  { id: 5, title: "Durée mission", icon: Clock },
  { id: 6, title: "Employeur", icon: Building2 },
  { id: 7, title: "Documents", icon: FileCheck },
  { id: 8, title: "Banque", icon: Landmark },
  { id: 9, title: "Services", icon: Package2 },
  { id: 10, title: "Rendez-vous", icon: Calendar },
];

export default function Expat() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedLifestyle, setSelectedLifestyle] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [employer, setEmployer] = useState<string>("");
  const [needsDocuments, setNeedsDocuments] = useState<boolean | null>(null);
  const [needsBanking, setNeedsBanking] = useState<boolean | null>(null);
  const [appointment, setAppointment] = useState<AppointmentData>({
    date: undefined,
    timeSlot: undefined,
  });

  const handleNext = () => {
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log({
        city: selectedCity,
        project: selectedProject,
        budget: selectedBudget,
        lifestyle: selectedLifestyle,
        duration: selectedDuration,
        employer,
        needsDocuments,
        needsBanking,
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
        return selectedBudget !== "";
      case 4:
        return selectedLifestyle !== "";
      case 5:
        return selectedDuration !== "";
      case 6:
        return true;
      case 7:
        return needsDocuments !== null;
      case 8:
        return needsBanking !== null;
      case 9:
        return true;
      case 10:
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
              Parcours <span className="text-3xl md:text-4xl lg:text-5xl text-primary font-batangas">Expatrié</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Facilitez votre installation au Congo en quelques étapes
            </p>
          </div>

          <div className="md:hidden">
            <div className="w-full rounded-2xl border border-border/50 bg-background/80 p-4 shadow-lg backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <div className="text-sm font-semibold">Étapes</div>
                  <div className="text-xs text-muted-foreground">
                    Étape {currentStep}/{steps.length}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 overflow-x-auto py-2">
                {steps.map((step) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <div key={step.id} className="shrink-0">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 mx-auto",
                          isActive &&
                            "bg-primary text-primary-foreground border-primary scale-105",
                          isCompleted && "bg-primary/20 text-primary border-primary",
                          !isActive &&
                            !isCompleted &&
                            "bg-muted text-muted-foreground border-border",
                        )}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <StepIcon className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "text-[11px] mt-2 text-center font-medium whitespace-nowrap",
                          isActive && "text-primary",
                          isCompleted && "text-primary",
                          !isActive && !isCompleted && "text-muted-foreground",
                        )}
                      >
                        {step.title}
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
                <div className="text-sm font-semibold">Étapes</div>
                <div className="text-xs text-muted-foreground">
                  Étape {currentStep}/{steps.length}
                </div>
              </div>

              <div className="flex flex-col items-center">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
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
                          <Check className="w-4 h-4" />
                        ) : (
                          <StepIcon className="w-4 h-4" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-xs mt-2 text-center font-medium hidden sm:block max-w-22",
                          isActive && "text-primary",
                          isCompleted && "text-primary",
                          !isActive && !isCompleted && "text-muted-foreground",
                        )}
                      >
                        {step.title}
                      </span>
                      {index < steps.length - 1 && (
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
                      Quelle est votre ville cible ?
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Sélectionnez la ville où vous souhaitez vous installer
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {cities.map((city) => (
                      <Card
                        key={city.id}
                        onClick={() => setSelectedCity(city.id)}
                        className={cn(
                          "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                          selectedCity === city.id
                            ? "border-primary/60 bg-linear-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/30"
                            : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/5 hover:to-transparent backdrop-blur-sm",
                        )}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{city.name}</CardTitle>
                              <CardDescription className="mt-1">
                                {city.description}
                              </CardDescription>
                            </div>
                            {selectedCity === city.id && (
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
                      Quel est votre type de projet ?
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Précisez la nature de votre venue au Congo
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {projectTypes.map((project) => {
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
                                    {project.name}
                                  </CardTitle>
                                  <CardDescription className="mt-1">
                                    {project.description}
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
                      Quel est votre budget mensuel ?
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Indiquez le budget mensuel que vous souhaitez allouer
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {budgetRanges.map((budget) => (
                      <Card
                        key={budget.id}
                        onClick={() => setSelectedBudget(budget.value)}
                        className={cn(
                          "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                          selectedBudget === budget.value
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
                                {budget.label}
                              </CardTitle>
                            </div>
                            {selectedBudget === budget.value && (
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
                      Quel niveau de vie souhaitez-vous ?
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Choisissez le standing qui correspond à vos attentes
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {lifestyles.map((lifestyle) => (
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
                                  {lifestyle.name}
                                </CardTitle>
                                {lifestyle.id === "ultra-premium" && (
                                  <Badge variant="secondary" className="text-xs">
                                    Exclusif
                                  </Badge>
                                )}
                              </div>
                              <CardDescription>
                                {lifestyle.description}
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
                      Quelle est la durée de votre mission ?
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Indiquez la durée prévue de votre expatriation
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {missionDurations.map((duration) => {
                      const DurationIcon = duration.icon;
                      return (
                        <Card
                          key={duration.id}
                          onClick={() => setSelectedDuration(duration.id)}
                          className={cn(
                            "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                            selectedDuration === duration.id
                              ? "border-primary/60 bg-linear-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/30"
                              : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/5 hover:to-transparent backdrop-blur-sm",
                          )}
                        >
                          <CardHeader>
                            <div className="flex flex-col items-center text-center gap-3">
                              <div className={cn("p-3 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-transform duration-300", duration.color)}>
                                <DurationIcon className="w-6 h-6" />
                              </div>
                              <div>
                                <CardTitle className="text-base mb-1">
                                  {duration.name}
                                </CardTitle>
                                <CardDescription>
                                  {duration.description}
                                </CardDescription>
                              </div>
                              {selectedDuration === duration.id && (
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

              {currentStep === 6 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                      Quel est votre employeur ? (Optionnel)
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Cette information nous aide à mieux vous accompagner
                    </p>
                  </div>
                  <Card className="p-6 border-border/50 bg-background/50 backdrop-blur-sm rounded-xl">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 text-primary mt-1">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label htmlFor="employer" className="text-base font-semibold">
                              Nom de l'employeur
                            </Label>
                            <p className="text-muted-foreground text-sm mt-1">
                              Vous pouvez laisser ce champ vide si vous préférez
                            </p>
                          </div>
                          <Input
                            id="employer"
                            placeholder="Ex: Total Energies, Banque Centrale du Congo..."
                            value={employer}
                            onChange={(e) => setEmployer(e.target.value)}
                            className="max-w-md"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {currentStep === 7 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                      Avez-vous besoin d'aide pour la formalisation de documents ?
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Permis de travail, visa, attestations administratives, etc.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <Card
                      onClick={() => setNeedsDocuments(true)}
                      className={cn(
                        "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                        needsDocuments === true
                          ? "border-primary/60 bg-linear-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/30"
                          : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-linear-to-br hover:from-primary/5 hover:to-transparent backdrop-blur-sm",
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                              <FileCheck className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base">Oui</CardTitle>
                              <CardDescription className="mt-1">
                                J'ai besoin d'accompagnement pour mes documents
                              </CardDescription>
                            </div>
                          </div>
                          {needsDocuments === true && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                    </Card>

                    <Card
                      onClick={() => setNeedsDocuments(false)}
                      className={cn(
                        "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                        needsDocuments === false
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
                              <CardTitle className="text-base">Non</CardTitle>
                              <CardDescription className="mt-1">
                                Mes documents sont déjà en ordre
                              </CardDescription>
                            </div>
                          </div>
                          {needsDocuments === false && (
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

              {currentStep === 8 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                      Avez-vous besoin d'une orientation bancaire ?
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Ouverture de compte, transferts, services bancaires locaux
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <Card
                      onClick={() => setNeedsBanking(true)}
                      className={cn(
                        "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                        needsBanking === true
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
                              <CardTitle className="text-base">Oui</CardTitle>
                              <CardDescription className="mt-1">
                                J'ai besoin d'aide pour mes démarches bancaires
                              </CardDescription>
                            </div>
                          </div>
                          {needsBanking === true && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                    </Card>

                    <Card
                      onClick={() => setNeedsBanking(false)}
                      className={cn(
                        "group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
                        needsBanking === false
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
                              <CardTitle className="text-base">Non</CardTitle>
                              <CardDescription className="mt-1">
                                J'ai déjà mes solutions bancaires
                              </CardDescription>
                            </div>
                          </div>
                          {needsBanking === false && (
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

            {currentStep === 9 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <ServiceSelectionSection userProfile="expat" />
              </div>
            )}

            {currentStep === 10 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <AppointmentStep
                  onAppointmentChange={setAppointment}
                  selectedServicesCount={0}
                  totalEstimate={0}
                />
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
                Retour
              </Button>

              <Button
                size="lg"
                onClick={handleNext}
                disabled={!isStepComplete()}
                className="gap-2 hover:scale-105 transition-transform duration-200 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl"
              >
                {currentStep === 10 ? "Procéder au paiement" : "Suivant"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}