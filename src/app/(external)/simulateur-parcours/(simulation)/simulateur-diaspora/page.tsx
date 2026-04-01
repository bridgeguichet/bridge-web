"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Globe, Home, Users, Briefcase, Lock, Sparkles, CheckCircle2, AlertCircle, TrendingUp, Calendar, MapPin, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

export default function SimulateurDiaspora() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    objectif: "",
    duree: "",
    budget: [5000],
    familySize: [1],
  });

  const progressPercentage = (currentStep / 3) * 100;

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-blue-500/5 via-background to-background">
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
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Parcours Diaspora</h1>
              <p className="text-muted-foreground">Reconnectez-vous avec vos racines</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Étape {currentStep} sur 3</p>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>Quel est votre objectif principal ?</CardTitle>
                <CardDescription>Sélectionnez ce qui correspond le mieux à votre projet</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.objectif} onValueChange={(value) => setFormData({ ...formData, objectif: value })}>
                  <div className="space-y-3">
                    {[
                      { value: "visite", label: "Visite familiale", icon: Users },
                      { value: "investissement", label: "Investissement immobilier", icon: Home },
                      { value: "business", label: "Opportunité business", icon: Briefcase },
                      { value: "installation", label: "Installation progressive", icon: MapPin },
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <div
                          key={option.value}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                            formData.objectif === option.value
                              ? "border-blue-500 bg-blue-500/5"
                              : "border-border hover:border-blue-500/30"
                          )}
                          onClick={() => setFormData({ ...formData, objectif: option.value })}
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Icon className="w-5 h-5 text-blue-500" />
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
                <CardTitle>Durée envisagée</CardTitle>
                <CardDescription>Combien de temps prévoyez-vous ?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.duree} onValueChange={(value) => setFormData({ ...formData, duree: value })}>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "court", label: "Court séjour", desc: "< 3 mois" },
                      { value: "moyen", label: "Moyen terme", desc: "3-12 mois" },
                      { value: "long", label: "Long terme", desc: "1-3 ans" },
                      { value: "permanent", label: "Installation", desc: "Permanent" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          formData.duree === option.value
                            ? "border-blue-500 bg-blue-500/5"
                            : "border-border hover:border-blue-500/30"
                        )}
                        onClick={() => setFormData({ ...formData, duree: option.value })}
                      >
                        <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={option.value} className="cursor-pointer font-medium">
                            {option.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">{option.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!formData.objectif || !formData.duree} size="lg">
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
                <CardTitle>Budget mensuel estimé</CardTitle>
                <CardDescription>Glissez pour ajuster (estimation approximative)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-500">${formData.budget[0]}</p>
                  <p className="text-sm text-muted-foreground mt-1">par mois</p>
                </div>
                <Slider
                  value={formData.budget}
                  onValueChange={(value) => setFormData({ ...formData, budget: value })}
                  min={1000}
                  max={10000}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$1 000</span>
                  <span>$10 000</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taille du groupe</CardTitle>
                <CardDescription>Combien de personnes vous accompagnent ?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-500">{formData.familySize[0]}</p>
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
            <Card className="border-2 border-blue-500/20">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  <Badge variant="outline" className="text-blue-500 border-blue-500">Aperçu personnalisé</Badge>
                </div>
                <CardTitle>Votre profil Diaspora</CardTitle>
                <CardDescription>Basé sur vos réponses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-center">
                    <DollarSign className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-500">${formData.budget[0]}</p>
                    <p className="text-xs text-muted-foreground mt-1">Budget mensuel</p>
                  </div>
                  <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-center">
                    <Calendar className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-500">{formData.duree === "court" ? "3" : formData.duree === "moyen" ? "6" : formData.duree === "long" ? "18" : "36"}+</p>
                    <p className="text-xs text-muted-foreground mt-1">Mois estimés</p>
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
                      Ceci est un <strong>aperçu simplifié</strong>. Pour obtenir votre stratégie complète avec budget détaillé, démarches administratives et contacts locaux, créez votre compte.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <CardTitle>Contenu exclusif débloqué après inscription</CardTitle>
                </div>
                <CardDescription>Accédez à votre analyse complète</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Budget détaillé par catégorie",
                    "Démarches administratives complètes",
                    "Contacts et partenaires locaux",
                    "Calendrier de mise en œuvre",
                    "Opportunités d'investissement",
                    "Réseau diaspora actif",
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
                    <h3 className="text-xl font-bold mb-2">Débloquez votre stratégie complète</h3>
                    <p className="text-muted-foreground">
                      Créez votre compte pour accéder à votre plan personnalisé et bénéficier d'un accompagnement expert
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