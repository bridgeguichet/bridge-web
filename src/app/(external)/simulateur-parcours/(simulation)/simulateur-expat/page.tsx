"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Plane, Home, Briefcase, Lock, Sparkles, CheckCircle2, AlertCircle, Calendar, Users, DollarSign, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

export default function SimulateurExpat() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    typeContrat: "",
    secteur: "",
    budget: [7000],
    familySize: [2],
  });

  const progressPercentage = (currentStep / 3) * 100;

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-emerald-500/5 via-background to-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6">
          <Link
            href="/simulateur-parcours"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux parcours
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <Plane className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Parcours Expatrié</h1>
              <p className="text-muted-foreground">Installation clé en main</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Étape {currentStep} sur 3</p>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>Type de contrat</CardTitle>
                <CardDescription>Quelle est votre situation professionnelle ?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.typeContrat} onValueChange={(value) => setFormData({ ...formData, typeContrat: value })}>
                  <div className="space-y-3">
                    {[
                      { value: "local", label: "Contrat local", icon: Building2 },
                      { value: "expat", label: "Package expatrié", icon: Plane },
                      { value: "entrepreneur", label: "Entrepreneur / Freelance", icon: Briefcase },
                      { value: "mutation", label: "Mutation interne", icon: Users },
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <div
                          key={option.value}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                            formData.typeContrat === option.value
                              ? "border-emerald-500 bg-emerald-500/5"
                              : "border-border hover:border-emerald-500/30"
                          )}
                          onClick={() => setFormData({ ...formData, typeContrat: option.value })}
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Icon className="w-5 h-5 text-emerald-500" />
                          <Label htmlFor={option.value} className="flex-1 cursor-pointer font-medium">
                            {option.label}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Secteur d'activité</CardTitle>
                <CardDescription>Dans quel domaine travaillez-vous ?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.secteur} onValueChange={(value) => setFormData({ ...formData, secteur: value })}>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "ong", label: "ONG / Humanitaire" },
                      { value: "mines", label: "Mines / Énergie" },
                      { value: "telecom", label: "Télécoms / Tech" },
                      { value: "finance", label: "Finance / Banque" },
                      { value: "construction", label: "Construction" },
                      { value: "autre", label: "Autre secteur" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          formData.secteur === option.value
                            ? "border-emerald-500 bg-emerald-500/5"
                            : "border-border hover:border-emerald-500/30"
                        )}
                        onClick={() => setFormData({ ...formData, secteur: option.value })}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer font-medium text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!formData.typeContrat || !formData.secteur} size="lg">
                Continuer
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>Budget mensuel disponible</CardTitle>
                <CardDescription>Estimation globale (logement, vie quotidienne, services)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-emerald-500">${formData.budget[0]}</p>
                  <p className="text-sm text-muted-foreground mt-1">par mois</p>
                </div>
                <Slider
                  value={formData.budget}
                  onValueChange={(value) => setFormData({ ...formData, budget: value })}
                  min={2000}
                  max={15000}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$2 000</span>
                  <span>$15 000</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Composition du foyer</CardTitle>
                <CardDescription>Nombre de personnes à installer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-emerald-500">{formData.familySize[0]}</p>
                  <p className="text-sm text-muted-foreground mt-1">personne(s)</p>
                </div>
                <Slider
                  value={formData.familySize}
                  onValueChange={(value) => setFormData({ ...formData, familySize: value })}
                  min={1}
                  max={6}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 personne</span>
                  <span>6 personnes</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button onClick={handleNext} size="lg" className="flex-1">
                Voir mon aperçu
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card className="border-2 border-emerald-500/20">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500">Aperçu personnalisé</Badge>
                </div>
                <CardTitle>Votre profil Expatrié</CardTitle>
                <CardDescription>Basé sur vos réponses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-center">
                    <DollarSign className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-500">${formData.budget[0]}</p>
                    <p className="text-xs text-muted-foreground mt-1">Budget mensuel</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-center">
                    <Briefcase className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-500 capitalize">{formData.typeContrat}</p>
                    <p className="text-xs text-muted-foreground mt-1">Type de contrat</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20 text-center">
                    <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-500">{formData.familySize[0]}</p>
                    <p className="text-xs text-muted-foreground mt-1">Personne(s)</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-dashed">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Ceci est un <strong>aperçu simplifié</strong>. Pour obtenir votre pack installation complet avec logements présélectionnés, services premium et conciergerie dédiée, créez votre compte.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <CardTitle>Services premium débloqués après inscription</CardTitle>
                </div>
                <CardDescription>Accédez à votre pack installation complet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Logements présélectionnés et visités",
                    "Conciergerie dédiée 24/7",
                    "Services d'installation (eau, électricité, internet)",
                    "Scolarité et écoles internationales",
                    "Assurance santé et cliniques partenaires",
                    "Réseau d'expatriés actif",
                  ].map((item, idx) => (
                    <div key={idx} className="relative p-3 rounded-lg border bg-muted/30 backdrop-blur-sm">
                      <div className="absolute inset-0 bg-linear-to-r from-background/80 to-background/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="opacity-40 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <p className="text-sm font-medium">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary bg-linear-to-br from-primary/5 to-background">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Accédez à votre pack installation complet</h3>
                    <p className="text-muted-foreground">
                      Créez votre compte pour débloquer tous les services premium et bénéficier d'une conciergerie dédiée
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button asChild size="lg" className="text-base">
                      <Link href="/auth/register">
                        Créer mon compte gratuit
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/">Parler à un conseiller</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-center gap-6 pt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-muted-foreground">Gratuit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-muted-foreground">Sans engagement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-muted-foreground">Accès immédiat</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Modifier mes réponses
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}