"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Rocket, GraduationCap, Briefcase, Lock, Sparkles, CheckCircle2, AlertCircle, Target, Users, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

export default function SimulateurNextGen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    objectif: "",
    domaine: "",
    experience: ["2"],
    ambition: ["3"],
  });

  const progressPercentage = (currentStep / 3) * 100;

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-amber-500/5 via-background to-background">
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
            <div className="p-3 rounded-xl bg-amber-500/10">
              <Rocket className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Parcours NextGen</h1>
              <p className="text-muted-foreground">Lancez votre carrière</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Étape {currentStep} sur 3</p>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>Objectif principal</CardTitle>
                <CardDescription>Que recherchez-vous ?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.objectif} onValueChange={(value) => setFormData({ ...formData, objectif: value })}>
                  <div className="space-y-3">
                    {[
                      { value: "stage", label: "Stage / Alternance", icon: GraduationCap },
                      { value: "premier-emploi", label: "Premier emploi", icon: Briefcase },
                      { value: "entrepreneuriat", label: "Lancer mon entreprise", icon: Rocket },
                      { value: "reseau", label: "Développer mon réseau", icon: Users },
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <div
                          key={option.value}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                            formData.objectif === option.value
                              ? "border-amber-500 bg-amber-500/5"
                              : "border-border hover:border-amber-500/30"
                          )}
                          onClick={() => setFormData({ ...formData, objectif: option.value })}
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Icon className="w-5 h-5 text-amber-500" />
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
                <CardTitle>Domaine d'intérêt</CardTitle>
                <CardDescription>Dans quel secteur souhaitez-vous évoluer ?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.domaine} onValueChange={(value) => setFormData({ ...formData, domaine: value })}>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "tech", label: "Tech / Digital" },
                      { value: "finance", label: "Finance / Banque" },
                      { value: "commerce", label: "Commerce / Vente" },
                      { value: "marketing", label: "Marketing / Com" },
                      { value: "ingenierie", label: "Ingénierie" },
                      { value: "autre", label: "Autre secteur" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          formData.domaine === option.value
                            ? "border-amber-500 bg-amber-500/5"
                            : "border-border hover:border-amber-500/30"
                        )}
                        onClick={() => setFormData({ ...formData, domaine: option.value })}
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
              <Button onClick={handleNext} disabled={!formData.objectif || !formData.domaine} size="lg">
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
                <CardTitle>Niveau d'expérience</CardTitle>
                <CardDescription>Où en êtes-vous dans votre parcours ?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-amber-500">
                    {formData.experience[0] === "1" ? "Débutant" : formData.experience[0] === "2" ? "Intermédiaire" : formData.experience[0] === "3" ? "Confirmé" : "Expert"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">niveau d'expérience</p>
                </div>
                <Slider
                  value={formData.experience.map(Number)}
                  onValueChange={(value) => setFormData({ ...formData, experience: value.map(String) })}
                  min={1}
                  max={4}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Débutant</span>
                  <span>Expert</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Niveau d'ambition</CardTitle>
                <CardDescription>Quelle est votre vision ?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-amber-500">
                    {formData.ambition[0] === "1" ? "Stable" : formData.ambition[0] === "2" ? "Progressif" : formData.ambition[0] === "3" ? "Ambitieux" : formData.ambition[0] === "4" ? "Très ambitieux" : "Visionnaire"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">niveau d'ambition</p>
                </div>
                <Slider
                  value={formData.ambition.map(Number)}
                  onValueChange={(value) => setFormData({ ...formData, ambition: value.map(String) })}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Stable</span>
                  <span>Visionnaire</span>
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
            <Card className="border-2 border-amber-500/20">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <Badge variant="outline" className="text-amber-500 border-amber-500">Aperçu personnalisé</Badge>
                </div>
                <CardTitle>Votre profil NextGen</CardTitle>
                <CardDescription>Basé sur vos réponses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 text-center">
                    <Target className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-amber-500 capitalize">{formData.objectif.replace("-", " ")}</p>
                    <p className="text-xs text-muted-foreground mt-1">Objectif</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-center">
                    <Briefcase className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-500 capitalize">{formData.domaine}</p>
                    <p className="text-xs text-muted-foreground mt-1">Domaine</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20 text-center">
                    <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-500">
                      {formData.ambition[0] === "1" ? "Stable" : formData.ambition[0] === "2" ? "Progressif" : formData.ambition[0] === "3" ? "Ambitieux" : formData.ambition[0] === "4" ? "Très ambitieux" : "Visionnaire"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Ambition</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-dashed">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Ceci est un <strong>aperçu simplifié</strong>. Pour obtenir votre plan carrière complet avec mentorat professionnel, réseau jeunes talents, opportunités exclusives et accompagnement personnalisé, créez votre compte.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <CardTitle>Programme complet débloqué après inscription</CardTitle>
                </div>
                <CardDescription>Accédez à votre plan carrière personnalisé</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Mentorat professionnel dédié",
                    "Réseau de jeunes talents actif",
                    "Opportunités carrière exclusives",
                    "Formation et développement",
                    "Accompagnement entrepreneurial",
                    "Événements networking premium",
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
                    <h3 className="text-xl font-bold mb-2">Débloquez votre plan carrière complet</h3>
                    <p className="text-muted-foreground">
                      Créez votre compte pour accéder au mentorat, réseau et opportunités exclusives
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