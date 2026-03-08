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
  Globe,
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
    icon: Globe,
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

const steps = [
  { id: 1, title: "Ville cible", icon: MapPin },
  { id: 2, title: "Type de projet", icon: Briefcase },
  { id: 3, title: "Budget mensuel", icon: DollarSign },
  { id: 4, title: "Niveau de vie", icon: Home },
];

export default function Diaspora() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedLifestyle, setSelectedLifestyle] = useState<string>("");

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log({
        city: selectedCity,
        project: selectedProject,
        budget: selectedBudget,
        lifestyle: selectedLifestyle,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/parcours");
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
      default:
        return false;
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-blue-500/5 via-background to-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Parcours Diaspora
              </h1>
              <p className="text-muted-foreground mt-1">
                Personnalisez votre expérience en quelques étapes
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mb-8">
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
                  Sélectionnez la ville où vous souhaitez vous rendre
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
                  Précisez la nature de votre venue au Congo
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
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-2">
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
                  Quel est votre budget mensuel ?
                </h2>
                <p className="text-muted-foreground">
                  Indiquez le budget mensuel que vous souhaitez allouer
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgetRanges.map((budget) => (
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
                          <CardTitle className="text-lg">
                            {budget.label}
                          </CardTitle>
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
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-2">
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
        </div>

        <div className="flex items-center justify-between gap-4 pt-6 border-t">
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 1 ? "Retour" : "Précédent"}
          </Button>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="gap-2"
          >
            {currentStep === 4 ? "Terminer" : "Suivant"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
