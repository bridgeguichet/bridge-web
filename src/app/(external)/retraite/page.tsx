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
  Coffee,
  Package2,
  X,
  Heart,
  Shield,
  Wallet,
  Calendar,
} from "lucide-react";
import Link from "next/link";

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
import { ServiceSelectionSection } from "@/features/services";
import { AppointmentStep } from "@/features/appointment";
import type { AppointmentData } from "@/features/appointment";
import { Logo } from "@/components/logo";

const cities = [
  { id: "kinshasa", name: "Kinshasa", description: "Capitale dynamique" },
  { id: "lubumbashi", name: "Lubumbashi", description: "Capitale minière" },
  { id: "kolwezi", name: "Kolwezi", description: "Pôle industriel" },
  { id: "matadi", name: "Matadi", description: "Ville portuaire" },
];

const projectTypes = [
  {
    id: "preparation-retraite",
    name: "Préparation retraite",
    description: "Planifier votre retraite au Congo",
    icon: Coffee,
  },
  {
    id: "installation-retraite",
    name: "Installation définitive",
    description: "S'installer pour profiter de sa retraite",
    icon: Home,
  },
  {
    id: "sejour-regulier",
    name: "Séjours réguliers",
    description: "Alterner entre pays d'origine et Congo",
    icon: MapPin,
  },
  {
    id: "retour-famille",
    name: "Retour en famille",
    description: "Rejoindre sa famille au pays",
    icon: Heart,
  },
];

const pensionRanges = [
  { id: "500-1000", label: "500$ - 1 000$", value: "500-1000" },
  { id: "1000-2000", label: "1 000$ - 2 000$", value: "1000-2000" },
  { id: "2000-3500", label: "2 000$ - 3 500$", value: "2000-3500" },
  { id: "3500-5000", label: "3 500$ - 5 000$", value: "3500-5000" },
  { id: "5000-plus", label: "5 000$ et plus", value: "5000-plus" },
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

const steps = [
  { id: 1, title: "Ville cible", icon: MapPin },
  { id: 2, title: "Type de projet", icon: Briefcase },
  { id: 3, title: "Pension", icon: Wallet },
  { id: 4, title: "Niveau de vie", icon: Home },
  { id: 5, title: "Suivi santé", icon: Heart },
  { id: 6, title: "Logement", icon: Shield },
  { id: 7, title: "Services", icon: Package2 },
  { id: 8, title: "Rendez-vous", icon: Calendar },
];

export default function Retraite() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedPension, setSelectedPension] = useState<string>("");
  const [selectedLifestyle, setSelectedLifestyle] = useState<string>("");
  const [needsHealthFollowup, setNeedsHealthFollowup] = useState<string>("");
  const [needsSecureHousing, setNeedsSecureHousing] = useState<string>("");
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
        return needsHealthFollowup !== "";
      case 6:
        return needsSecureHousing !== "";
      case 7:
        return true;
      case 8:
        return appointment.date !== undefined && appointment.timeSlot !== undefined;
      default:
        return false;
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-rose-500/5 via-background to-background">
      <div className="container mx-auto px-4 py-12">
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
            <h1 className="text-3xl md:text-4xl font-bold">Parcours Retraite</h1>
            <p className="text-muted-foreground mt-1">
              Préparez sereinement votre retraite au Congo
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
                <h2 className="text-2xl font-bold mb-2">
                  Quelle est votre ville cible ?
                </h2>
                <p className="text-muted-foreground">
                  Sélectionnez la ville où vous souhaitez passer votre retraite
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cities.map((city) => (
                  <Card
                    key={city.id}
                    onClick={() => setSelectedCity(city.id)}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                      selectedCity === city.id
                        ? "border-2 border-primary bg-primary/5"
                        : "border-2 border-transparent hover:border-primary/30",
                    )}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">{city.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {city.description}
                          </CardDescription>
                        </div>
                        {selectedCity === city.id && (
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

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Quel est votre type de projet ?
                </h2>
                <p className="text-muted-foreground">
                  Précisez la nature de votre projet de retraite
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectTypes.map((project) => {
                  const ProjectIcon = project.icon;
                  return (
                    <Card
                      key={project.id}
                      onClick={() => setSelectedProject(project.id)}
                      className={cn(
                        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                        selectedProject === project.id
                          ? "border-2 border-primary bg-primary/5"
                          : "border-2 border-transparent hover:border-primary/30",
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <ProjectIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                {project.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {project.description}
                              </CardDescription>
                            </div>
                          </div>
                          {selectedProject === project.id && (
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

          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Quelle est votre pension mensuelle ?
                </h2>
                <p className="text-muted-foreground">
                  Indiquez le montant de votre pension mensuelle pour mieux vous orienter
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pensionRanges.map((pension) => (
                  <Card
                    key={pension.id}
                    onClick={() => setSelectedPension(pension.value)}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                      selectedPension === pension.value
                        ? "border-2 border-primary bg-primary/5"
                        : "border-2 border-transparent hover:border-primary/30",
                    )}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <CardTitle className="text-lg">
                            {pension.label}
                          </CardTitle>
                        </div>
                        {selectedPension === pension.value && (
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

          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Quel niveau de vie souhaitez-vous ?
                </h2>
                <p className="text-muted-foreground">
                  Choisissez le standing qui correspond à vos attentes
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lifestyles.map((lifestyle) => (
                  <Card
                    key={lifestyle.id}
                    onClick={() => setSelectedLifestyle(lifestyle.id)}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden",
                      selectedLifestyle === lifestyle.id
                        ? "border-2 border-primary bg-primary/5"
                        : "border-2 border-transparent hover:border-primary/30",
                    )}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">
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
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <div
                      className={cn(
                        "absolute bottom-0 left-0 right-0 h-1 transition-all duration-300",
                        selectedLifestyle === lifestyle.id
                          ? lifestyle.bgColor
                          : "bg-transparent",
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
                <h2 className="text-2xl font-bold mb-2">
                  Avez-vous besoin d'un suivi santé régulier ?
                </h2>
                <p className="text-muted-foreground">
                  Indiquez si vous nécessitez un accompagnement médical continu
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Card
                  onClick={() => setNeedsHealthFollowup("yes")}
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                    needsHealthFollowup === "yes"
                      ? "border-2 border-primary bg-primary/5"
                      : "border-2 border-transparent hover:border-primary/30",
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                          <Heart className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">Oui</CardTitle>
                          <CardDescription className="mt-1">
                            J'ai besoin d'un suivi médical régulier
                          </CardDescription>
                        </div>
                      </div>
                      {needsHealthFollowup === "yes" && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </Card>

                <Card
                  onClick={() => setNeedsHealthFollowup("no")}
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                    needsHealthFollowup === "no"
                      ? "border-2 border-primary bg-primary/5"
                      : "border-2 border-transparent hover:border-primary/30",
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                          <Heart className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">Non</CardTitle>
                          <CardDescription className="mt-1">
                            Je suis en bonne santé
                          </CardDescription>
                        </div>
                      </div>
                      {needsHealthFollowup === "no" && (
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

          {currentStep === 6 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Avez-vous besoin d'un logement sécurisé ?
                </h2>
                <p className="text-muted-foreground">
                  Indiquez si vous recherchez un logement dans un quartier sécurisé
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Card
                  onClick={() => setNeedsSecureHousing("yes")}
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                    needsSecureHousing === "yes"
                      ? "border-2 border-primary bg-primary/5"
                      : "border-2 border-transparent hover:border-primary/30",
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">Oui</CardTitle>
                          <CardDescription className="mt-1">
                            Je recherche un logement sécurisé
                          </CardDescription>
                        </div>
                      </div>
                      {needsSecureHousing === "yes" && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </Card>

                <Card
                  onClick={() => setNeedsSecureHousing("no")}
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                    needsSecureHousing === "no"
                      ? "border-2 border-primary bg-primary/5"
                      : "border-2 border-transparent hover:border-primary/30",
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">Non</CardTitle>
                          <CardDescription className="mt-1">
                            J'ai déjà un logement ou une solution
                          </CardDescription>
                        </div>
                      </div>
                      {needsSecureHousing === "no" && (
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

          {currentStep === 7 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <ServiceSelectionSection userProfile="retraite" />
            </div>
          )}

          {currentStep === 8 && (
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
            {currentStep === 8 ? "Procéder au paiement" : "Suivant"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}