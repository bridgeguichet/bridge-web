"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
  Target,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Globe,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface PathwayOption {
  id: string;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
}

interface SimulationStepsProps {
  pathwayOptions: PathwayOption[];
  selectedPathway: string;
  onPathwaySelect: (id: string) => void;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export function SimulationSteps({
  pathwayOptions,
  selectedPathway,
  onPathwaySelect,
  currentStep,
  onNextStep,
  onPrevStep,
}: SimulationStepsProps) {
  const selectedPathwayData = pathwayOptions.find((p) => p.id === selectedPathway);

  const previewData = {
    potential: Math.floor(Math.random() * 30) + 15,
    opportunities: Math.floor(Math.random() * 5) + 3,
    readiness: Math.floor(Math.random() * 30) + 65,
  };

  if (currentStep === 1) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Choisissez votre profil</CardTitle>
            <CardDescription>Sélectionnez le parcours qui correspond le mieux à votre situation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pathwayOptions.map((pathway) => {
                const Icon = pathway.icon;
                return (
                  <div
                    key={pathway.id}
                    onClick={() => onPathwaySelect(pathway.id)}
                    className={cn(
                      "p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg",
                      selectedPathway === pathway.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("p-3 rounded-lg bg-muted", pathway.color)}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{pathway.label}</p>
                      </div>
                      {selectedPathway === pathway.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={onNextStep} disabled={!selectedPathway} size="lg">
                Continuer
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 3) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={cn("p-3 rounded-lg", selectedPathwayData?.color)}>
                {selectedPathwayData && <selectedPathwayData.icon className="w-6 h-6" />}
              </div>
              <div>
                <CardTitle>Votre aperçu personnalisé</CardTitle>
                <CardDescription>Parcours {selectedPathwayData?.label}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-xl bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <p className="text-sm font-medium text-muted-foreground">Potentiel estimé</p>
                </div>
                <p className="text-3xl font-bold text-blue-500">+{previewData.potential}%</p>
                <p className="text-xs text-muted-foreground mt-1">Retour sur investissement potentiel</p>
              </div>

              <div className="p-6 rounded-xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <p className="text-sm font-medium text-muted-foreground">Opportunités</p>
                </div>
                <p className="text-3xl font-bold text-emerald-500">{previewData.opportunities}</p>
                <p className="text-xs text-muted-foreground mt-1">Opportunités identifiées pour votre profil</p>
              </div>

              <div className="p-6 rounded-xl bg-linear-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500" />
                  <p className="text-sm font-medium text-muted-foreground">Score de préparation</p>
                </div>
                <p className="text-3xl font-bold text-purple-500">{previewData.readiness}%</p>
                <p className="text-xs text-muted-foreground mt-1">Niveau de préparation actuel</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-dashed">
              <p className="text-sm text-muted-foreground text-center">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Basé sur votre profil initial
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <CardTitle>Contenu exclusif débloqué après validation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Target, label: "Stratégie détaillée personnalisée" },
                { icon: Clock, label: "Feuille de route étape par étape" },
                { icon: Users, label: "Recommandations d'experts" },
                { icon: DollarSign, label: "Plan budgétaire complet" },
                { icon: TrendingUp, label: "Calendrier de mise en œuvre" },
                { icon: Globe, label: "Réseau de contacts qualifiés" },
              ].map((item, index) => (
                <div key={index} className="relative p-4 rounded-lg border bg-muted/30 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-linear-to-r from-background/80 to-background/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="opacity-40 flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <p className="font-medium text-sm">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onPrevStep} size="lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button onClick={onNextStep} size="lg" className="flex-1">
            Débloquer mon analyse complète
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === 4) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-2 border-primary">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Transformez votre projet en réalité</CardTitle>
            <CardDescription className="text-base">
              Accédez à votre simulation complète et bénéficiez d'un accompagnement personnalisé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
                <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">Analyse personnalisée</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">Accompagnement expert</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">Stratégie sur-mesure</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Button asChild size="lg" className="w-full text-lg h-14">
                <Link href="/auth/register">
                  Débloquer ma simulation complète
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/auth/register">Créer mon compte gratuit</Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Places limitées</p>
                <p className="font-semibold text-sm text-primary">Aujourd'hui</p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Déjà accompagnés</p>
                <p className="font-semibold text-sm text-primary">+1 200 personnes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" onClick={onPrevStep}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'aperçu
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
