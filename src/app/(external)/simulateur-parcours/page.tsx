"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Car,
  Dumbbell,
  Utensils,
  Zap,
  Wifi,
  GraduationCap,
  ShoppingBag,
  Heart,
  Calculator,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Globe,
  Plane,
  Coffee,
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
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { SimulationSteps } from "./components/SimulationSteps";

const housingOptions = [
  {
    id: "studio",
    label: "Studio",
    price: 300,
    description: "Logement compact",
  },
  {
    id: "appartement-1ch",
    label: "Appartement 1 chambre",
    price: 500,
    description: "Confortable",
  },
  {
    id: "appartement-2ch",
    label: "Appartement 2 chambres",
    price: 800,
    description: "Familial",
  },
  {
    id: "appartement-3ch",
    label: "Appartement 3 chambres",
    price: 1200,
    description: "Spacieux",
  },
  {
    id: "villa-residentiel",
    label: "Villa résidentielle",
    price: 2000,
    description: "Sécurisé",
  },
  {
    id: "villa-premium",
    label: "Villa premium",
    price: 3500,
    description: "Haut standing",
  },
];

const transportOptions = [
  {
    id: "transport-commun",
    label: "Transport en commun",
    price: 50,
    description: "Bus et taxis",
  },
  {
    id: "moto-taxi",
    label: "Moto-taxi régulier",
    price: 100,
    description: "Déplacements rapides",
  },
  {
    id: "voiture-personnelle",
    label: "Voiture personnelle",
    price: 400,
    description: "Avec carburant",
  },
  {
    id: "chauffeur-prive",
    label: "Chauffeur privé",
    price: 800,
    description: "Service dédié",
  },
];

const gymOptions = [
  { id: "none", label: "Aucun", price: 0, description: "Pas d'abonnement" },
  {
    id: "basic",
    label: "Salle basique",
    price: 30,
    description: "Équipements standards",
  },
  {
    id: "premium",
    label: "Salle premium",
    price: 80,
    description: "Équipements modernes",
  },
  {
    id: "luxury",
    label: "Club de sport",
    price: 150,
    description: "Spa et piscine inclus",
  },
];

const foodOptions = [
  {
    id: "economique",
    label: "Économique",
    price: 200,
    description: "Cuisine locale",
  },
  {
    id: "standard",
    label: "Standard",
    price: 400,
    description: "Mixte local/importé",
  },
  {
    id: "premium",
    label: "Premium",
    price: 700,
    description: "Produits importés",
  },
  {
    id: "gourmet",
    label: "Gourmet",
    price: 1200,
    description: "Restaurants réguliers",
  },
];

const utilitiesBase = {
  electricity: 80,
  water: 40,
  internet: 60,
  phone: 30,
};

const additionalServices = [
  { id: "femme-menage", label: "Femme de ménage", price: 150, icon: Home },
  { id: "gardien", label: "Gardien", price: 100, icon: AlertCircle },
  {
    id: "cours-particuliers",
    label: "Cours particuliers",
    price: 200,
    icon: GraduationCap,
  },
  { id: "assurance-sante", label: "Assurance santé", price: 120, icon: Heart },
  { id: "loisirs", label: "Loisirs & sorties", price: 250, icon: Sparkles },
];

const pathwayOptions = [
  { id: "diaspora", label: "Diaspora", icon: Globe, color: "text-blue-500", bgColor: "bg-blue-500" },
  { id: "expat", label: "Expatrié", icon: Plane, color: "text-emerald-500", bgColor: "bg-emerald-500" },
  { id: "investisseur", label: "Investisseur", icon: TrendingUp, color: "text-purple-500", bgColor: "bg-purple-500" },
  { id: "retraite", label: "Retraite", icon: Coffee, color: "text-rose-500", bgColor: "bg-rose-500" },
  { id: "nextgen", label: "NextGen", icon: Zap, color: "text-amber-500", bgColor: "bg-amber-500" },
];

export default function SimulateurParcours() {
  const searchParams = useSearchParams();
  const pathwayParam = searchParams.get("pathway");

  const [currentStep, setCurrentStep] = useState(pathwayParam ? 2 : 1);
  const [selectedPathway, setSelectedPathway] = useState(pathwayParam || "");
  const [selectedHousing, setSelectedHousing] = useState("appartement-1ch");
  const [selectedTransport, setSelectedTransport] = useState("voiture-personnelle");
  const [selectedGym, setSelectedGym] = useState("basic");
  const [selectedFood, setSelectedFood] = useState("standard");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [familySize, setFamilySize] = useState([1]);

  useEffect(() => {
    if (pathwayParam && pathwayOptions.find(p => p.id === pathwayParam)) {
      setSelectedPathway(pathwayParam);
      setCurrentStep(2);
    }
  }, [pathwayParam]);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const handlePathwaySelect = (pathwayId: string) => {
    setSelectedPathway(pathwayId);
    setCurrentStep(2);
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const totalBudget = useMemo(() => {
    const housing =
      housingOptions.find((h) => h.id === selectedHousing)?.price || 0;
    const transport =
      transportOptions.find((t) => t.id === selectedTransport)?.price || 0;
    const gym = gymOptions.find((g) => g.id === selectedGym)?.price || 0;
    const food = foodOptions.find((f) => f.id === selectedFood)?.price || 0;
    const utilities = Object.values(utilitiesBase).reduce(
      (sum, val) => sum + val,
      0,
    );
    const services = selectedServices.reduce((sum, serviceId) => {
      const service = additionalServices.find((s) => s.id === serviceId);
      return sum + (service?.price || 0);
    }, 0);

    const familyMultiplier = familySize[0];
    const foodAdjusted = food * Math.max(1, familyMultiplier * 0.7);

    return housing + transport + gym + foodAdjusted + utilities + services;
  }, [
    selectedHousing,
    selectedTransport,
    selectedGym,
    selectedFood,
    selectedServices,
    familySize,
  ]);

  const recommendations = useMemo(() => {
    const recs = [];

    if (totalBudget < 1000) {
      recs.push({
        title: "Court séjour découverte recommandé",
        description:
          "Explorez Kinshasa avant de vous engager sur du long terme",
        type: "info",
      });
    }

    if (totalBudget >= 1000 && totalBudget < 2500) {
      recs.push({
        title: "Pack Installation Sérénité",
        description: "Accompagnement complet pour votre installation",
        type: "success",
      });
    }

    if (totalBudget >= 2500) {
      recs.push({
        title: "Service Signature conseillé",
        description: "Service premium avec conciergerie dédiée",
        type: "premium",
      });
      recs.push({
        title: "Consultation stratégique obligatoire",
        description: "Optimisez votre budget et vos choix d'investissement",
        type: "warning",
      });
    }

    if (selectedServices.includes("assurance-sante")) {
      recs.push({
        title: "Partenariat clinique internationale",
        description: "Accès à des soins de santé de qualité",
        type: "info",
      });
    }

    if (familySize[0] > 2) {
      recs.push({
        title: "Pack Famille recommandé",
        description:
          "Services adaptés pour les familles (école, activités enfants)",
        type: "success",
      });
    }

    return recs;
  }, [totalBudget, selectedServices, familySize]);

  const budgetLevel = useMemo(() => {
    if (totalBudget < 1000)
      return { label: "Économique", color: "text-blue-500", bg: "bg-blue-500" };
    if (totalBudget < 2500)
      return {
        label: "Confortable",
        color: "text-emerald-500",
        bg: "bg-emerald-500",
      };
    if (totalBudget < 5000)
      return {
        label: "Premium",
        color: "text-purple-500",
        bg: "bg-purple-500",
      };
    return { label: "Luxe", color: "text-amber-500", bg: "bg-amber-500" };
  }, [totalBudget]);

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="relative min-h-screen bg-linear-to-br from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                <Calculator className="w-4 h-4" />
                Simulation personnalisée
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {currentStep === 1 && "Sélectionnez votre parcours"}
                {currentStep === 2 && "Personnalisez votre simulation"}
                {currentStep === 3 && "Votre aperçu personnalisé"}
                {currentStep === 4 && "Débloquez votre analyse complète"}
              </h1>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-muted-foreground text-sm">Étape {currentStep} sur 4</p>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <SimulationSteps
          pathwayOptions={pathwayOptions}
          selectedPathway={selectedPathway}
          onPathwaySelect={handlePathwaySelect}
          currentStep={currentStep}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
        />

        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-in fade-in slide-in-from-left-4 duration-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle>Type de logement</CardTitle>
                    <CardDescription>
                      Choisissez votre type d'habitation
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {housingOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setSelectedHousing(option.id)}
                      className={cn(
                        "p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md",
                        selectedHousing === option.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{option.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          ${option.price}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle>Transport</CardTitle>
                    <CardDescription>
                      Mode de déplacement quotidien
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {transportOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setSelectedTransport(option.id)}
                      className={cn(
                        "p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md",
                        selectedTransport === option.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{option.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          ${option.price}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle>Salle de sport</CardTitle>
                      <CardDescription>Abonnement fitness</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {gymOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setSelectedGym(option.id)}
                        className={cn(
                          "p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md",
                          selectedGym === option.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">
                              {option.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            ${option.price}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle>Alimentation</CardTitle>
                      <CardDescription>Budget nourriture</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {foodOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setSelectedFood(option.id)}
                        className={cn(
                          "p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md",
                          selectedFood === option.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">
                              {option.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            ${option.price}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="animate-in fade-in slide-in-from-left-4 duration-700 delay-400">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle>Charges fixes</CardTitle>
                    <CardDescription>
                      Électricité, eau, internet, téléphone
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Électricité</span>
                    </div>
                    <Badge variant="outline">
                      ${utilitiesBase.electricity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Eau</span>
                    </div>
                    <Badge variant="outline">${utilitiesBase.water}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Internet</span>
                    </div>
                    <Badge variant="outline">${utilitiesBase.internet}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Téléphone</span>
                    </div>
                    <Badge variant="outline">${utilitiesBase.phone}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in slide-in-from-left-4 duration-700 delay-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle>Services additionnels</CardTitle>
                    <CardDescription>
                      Sélectionnez les services souhaités
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {additionalServices.map((service) => {
                    const ServiceIcon = service.icon;
                    const isSelected = selectedServices.includes(service.id);
                    return (
                      <div
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={cn(
                          "p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <ServiceIcon className="w-5 h-5 text-primary" />
                            <span className="font-medium text-sm">
                              {service.label}
                            </span>
                          </div>
                          <Badge variant={isSelected ? "default" : "secondary"}>
                            ${service.price}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in slide-in-from-left-4 duration-700 delay-600">
              <CardHeader>
                <CardTitle>Taille du foyer</CardTitle>
                <CardDescription>
                  Nombre de personnes dans votre foyer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {familySize[0]} personne(s)
                    </span>
                    <Badge variant="outline">
                      Ajuste le budget alimentation
                    </Badge>
                  </div>
                  <Slider
                    value={familySize}
                    onValueChange={setFamilySize}
                    min={1}
                    max={6}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 personne</span>
                    <span>6 personnes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handlePrevStep} size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button onClick={handleNextStep} size="lg" className="flex-1">
                Voir mon aperçu
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <Card className="animate-in fade-in slide-in-from-right-4 duration-700 border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <CardTitle>Résultat du simulateur</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">
                      Budget mensuel estimé
                    </p>
                    <p className="text-5xl font-extrabold text-primary mb-2">
                      ${totalBudget.toFixed(0)}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn("text-sm", budgetLevel.color)}
                    >
                      Niveau {budgetLevel.label}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Répartition du budget
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Logement</span>
                        <span className="font-semibold">
                          $
                          {housingOptions.find((h) => h.id === selectedHousing)
                            ?.price || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Transport</span>
                        <span className="font-semibold">
                          $
                          {transportOptions.find(
                            (t) => t.id === selectedTransport,
                          )?.price || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Alimentation
                        </span>
                        <span className="font-semibold">
                          $
                          {(
                            (foodOptions.find((f) => f.id === selectedFood)
                              ?.price || 0) * Math.max(1, familySize[0] * 0.7)
                          ).toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Charges fixes
                        </span>
                        <span className="font-semibold">
                          $
                          {Object.values(utilitiesBase).reduce(
                            (sum, val) => sum + val,
                            0,
                          )}
                        </span>
                      </div>
                      {gymOptions.find((g) => g.id === selectedGym)?.price !==
                        0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Sport</span>
                          <span className="font-semibold">
                            $
                            {gymOptions.find((g) => g.id === selectedGym)
                              ?.price || 0}
                          </span>
                        </div>
                      )}
                      {selectedServices.length > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Services additionnels
                          </span>
                          <span className="font-semibold">
                            $
                            {selectedServices.reduce((sum, serviceId) => {
                              const service = additionalServices.find(
                                (s) => s.id === serviceId,
                              );
                              return sum + (service?.price || 0);
                            }, 0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center text-muted-foreground text-xs">
                    Estimation basée sur vos choix
                  </div>
                </CardContent>
              </Card>

              {recommendations.length > 0 && (
                <Card className="animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Recommandations
                    </CardTitle>
                    <CardDescription>
                      Suggestions personnalisées pour vous
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-4 rounded-lg border-l-4 transition-all duration-300 hover:shadow-md",
                          rec.type === "success" &&
                            "border-l-emerald-500 bg-emerald-500/5",
                          rec.type === "warning" &&
                            "border-l-amber-500 bg-amber-500/5",
                          rec.type === "info" &&
                            "border-l-blue-500 bg-blue-500/5",
                          rec.type === "premium" &&
                            "border-l-purple-500 bg-purple-500/5",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {rec.type === "success" && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          )}
                          {rec.type === "warning" && (
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          {rec.type === "info" && (
                            <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                          )}
                          {rec.type === "premium" && (
                            <Sparkles className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-sm mb-1">
                              {rec.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {rec.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
