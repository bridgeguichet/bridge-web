"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Palmtree, Heart, Lock, Sparkles, CheckCircle2, AlertCircle, DollarSign, Calendar, Users, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

export default function SimulateurRetraite() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    typeRetraite: "",
    priorite: "",
    budget: [3000],
    age: [60],
  });

  const progressPercentage = (currentStep / 3) * 100;

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-rose-500/5 via-background to-background">
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
            <div className="p-3 rounded-xl bg-rose-500/10">
              <Palmtree className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Parcours Retraite</h1>
              <p className="text-muted-foreground">Préparez une retraite paisible</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Étape {currentStep} sur 3</p>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>Type de retraite envisagée</CardTitle>
                <CardDescription>Quel est votre projet ?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.typeRetraite} onValueChange={(value) => setFormData({ ...formData, typeRetraite: value })}>
                  <div className="space-y-3">
                    {[
                      { value: "partielle", label: "Retraite partielle", icon: Calendar },
                      { value: "complete", label: "Retraite complète", icon: Palmtree },
                      { value: "active", label: "Retraite active (projets)", icon: Sparkles },
                      { value: "saisonniere", label: "Résidence saisonnière", icon: Home },
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <div
                          key={option.value}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                            formData.typeRetraite === option.value
                              ? "border-rose-500 bg-rose-500/5"
                              : "border-border hover:border-rose-500/30"
                          )}
                          onClick={() => setFormData({ ...formData, typeRetraite: option.value })}
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Icon className="w-5 h-5 text-rose-500" />
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
                <CardTitle>Priorité principale</CardTitle>
                <CardDescription>Qu'est-ce qui compte le plus pour vous ?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.priorite} onValueChange={(value) => setFormData({ ...formData, priorite: value })}>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "sante", label: "Services santé" },
                      { value: "calme", label: "Cadre paisible" },
                      { value: "communaute", label: "Communauté active" },
                      { value: "famille", label: "Proximité famille" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          formData.priorite === option.value
                            ? "border-rose-500 bg-rose-500/5"
                            : "border-border hover:border-rose-500/30"
                        )}
                        onClick={() => setFormData({ ...formData, priorite: option.value })}
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
              <Button onClick={handleNext} disabled={!formData.typeRetraite || !formData.priorite} size="lg">
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
                <CardDescription>Pension et ressources mensuelles (estimation)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-rose-500">${formData.budget[0]}</p>
                  <p className="text-sm text-muted-foreground mt-1">par mois</p>
                </div>
                <Slider
                  value={formData.budget}
                  onValueChange={(value) => setFormData({ ...formData, budget: value })}
                  min={1000}
                  max={8000}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$1 000</span>
                  <span>$8 000</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Âge actuel</CardTitle>
                <CardDescription>Pour personnaliser votre plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-rose-500">{formData.age[0]} ans</p>
                  <p className="text-sm text-muted-foreground mt-1">âge</p>
                </div>
                <Slider
                  value={formData.age}
                  onValueChange={(value) => setFormData({ ...formData, age: value })}
                  min={50}
                  max={75}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>50 ans</span>
                  <span>75 ans</span>
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
            <Card className="border-2 border-rose-500/20">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  <Badge variant="outline" className="text-rose-500 border-rose-500">Aperçu personnalisé</Badge>
                </div>
                <CardTitle>Votre profil Retraite</CardTitle>
                <CardDescription>Basé sur vos réponses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/20 text-center">
                    <DollarSign className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-rose-500">${formData.budget[0]}</p>
                    <p className="text-xs text-muted-foreground mt-1">Budget mensuel</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-center">
                    <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-500">{formData.age[0]} ans</p>
                    <p className="text-xs text-muted-foreground mt-1">Âge actuel</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20 text-center">
                    <Heart className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-500 capitalize">{formData.priorite}</p>
                    <p className="text-xs text-muted-foreground mt-1">Priorité</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-dashed">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Ceci est un <strong>aperçu simplifié</strong>. Pour obtenir votre plan retraite complet avec cadre de vie adapté, services santé, communauté active et accompagnement personnalisé, créez votre compte.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <CardTitle>Plan complet débloqué après inscription</CardTitle>
                </div>
                <CardDescription>Accédez à votre plan retraite personnalisé</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Cadre de vie adapté et sécurisé",
                    "Services santé et cliniques partenaires",
                    "Communauté de retraités actifs",
                    "Activités et loisirs organisés",
                    "Accompagnement administratif complet",
                    "Plan financier optimisé",
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
                    <h3 className="text-xl font-bold mb-2">Débloquez votre plan retraite complet</h3>
                    <p className="text-muted-foreground">
                      Créez votre compte pour accéder à votre plan personnalisé et bénéficier d'un accompagnement dédié
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