"use client";

import { useState } from "react";

import Link from "next/link";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Lock,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

export default function SimulateurNextGen() {
  const { t } = useTranslation();
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
            {t("simulator.backToPathways")}
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <Rocket className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{t("simulator.nextgen.title")}</h1>
              <p className="text-muted-foreground">{t("simulator.nextgen.subtitle")}</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {t("simulator.stepOf", { current: currentStep, total: 3 })}
          </p>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>{t("simulator.nextgen.mainGoal")}</CardTitle>
                <CardDescription>{t("simulator.nextgen.whatLookingFor")}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.objectif}
                  onValueChange={(value) => setFormData({ ...formData, objectif: value })}
                >
                  <div className="space-y-3">
                    {[
                      { value: "stage", labelKey: "simulator.nextgen.goals.internship", icon: GraduationCap },
                      { value: "premier-emploi", labelKey: "simulator.nextgen.goals.firstJob", icon: Briefcase },
                      { value: "entrepreneuriat", labelKey: "simulator.nextgen.goals.startBusiness", icon: Rocket },
                      { value: "reseau", labelKey: "simulator.nextgen.goals.network", icon: Users },
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <div
                          key={option.value}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                            formData.objectif === option.value
                              ? "border-amber-500 bg-amber-500/5"
                              : "border-border hover:border-amber-500/30",
                          )}
                          onClick={() => setFormData({ ...formData, objectif: option.value })}
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Icon className="w-5 h-5 text-amber-500" />
                          <Label htmlFor={option.value} className="flex-1 cursor-pointer font-medium">
                            {t(option.labelKey)}
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
                <CardTitle>{t("simulator.nextgen.interestDomain")}</CardTitle>
                <CardDescription>{t("simulator.nextgen.sectorToEvolve")}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.domaine}
                  onValueChange={(value) => setFormData({ ...formData, domaine: value })}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "tech", labelKey: "simulator.nextgen.domains.tech" },
                      { value: "finance", labelKey: "simulator.nextgen.domains.finance" },
                      { value: "commerce", labelKey: "simulator.nextgen.domains.commerce" },
                      { value: "marketing", labelKey: "simulator.nextgen.domains.marketing" },
                      { value: "ingenierie", labelKey: "simulator.nextgen.domains.engineering" },
                      { value: "autre", labelKey: "simulator.nextgen.domains.other" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          formData.domaine === option.value
                            ? "border-amber-500 bg-amber-500/5"
                            : "border-border hover:border-amber-500/30",
                        )}
                        onClick={() => setFormData({ ...formData, domaine: option.value })}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer font-medium text-sm">
                          {t(option.labelKey)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!formData.objectif || !formData.domaine} size="lg">
                {t("simulator.continue")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>{t("simulator.nextgen.experienceLevel")}</CardTitle>
                <CardDescription>{t("simulator.nextgen.whereAreYou")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-amber-500">
                    {t(
                      `simulator.nextgen.levels.${formData.experience[0] === "1" ? "beginner" : formData.experience[0] === "2" ? "intermediate" : formData.experience[0] === "3" ? "confirmed" : "expert"}`,
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{t("simulator.nextgen.experienceLevel")}</p>
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
                  <span>{t("simulator.nextgen.levels.beginner")}</span>
                  <span>{t("simulator.nextgen.levels.expert")}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("simulator.nextgen.ambitionLevel")}</CardTitle>
                <CardDescription>{t("simulator.nextgen.yourVision")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-amber-500">
                    {t(
                      `simulator.nextgen.ambitions.${formData.ambition[0] === "1" ? "stable" : formData.ambition[0] === "2" ? "progressive" : formData.ambition[0] === "3" ? "ambitious" : formData.ambition[0] === "4" ? "veryAmbitious" : "visionary"}`,
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{t("simulator.nextgen.ambitionLevel")}</p>
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
                  <span>{t("simulator.nextgen.ambitions.stable")}</span>
                  <span>{t("simulator.nextgen.ambitions.visionary")}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} size="lg" className="hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("simulator.back")}
              </Button>
              <Button onClick={handleNext} size="lg" className="flex-1">
                {t("simulator.viewPreview")}
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
                  <Badge variant="outline" className="text-amber-500 border-amber-500">
                    {t("simulator.common.personalizedPreview")}
                  </Badge>
                </div>
                <CardTitle>{t("simulator.nextgen.yourProfile")}</CardTitle>
                <CardDescription>{t("simulator.common.basedOnAnswers")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 text-center">
                    <Target className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-amber-500 capitalize">
                      {formData.objectif.replace("-", " ")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{t("simulator.nextgen.objective")}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-center">
                    <Briefcase className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-500 capitalize">{formData.domaine}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("simulator.nextgen.domain")}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20 text-center">
                    <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-500">
                      {t(
                        `simulator.nextgen.ambitions.${formData.ambition[0] === "1" ? "stable" : formData.ambition[0] === "2" ? "progressive" : formData.ambition[0] === "3" ? "ambitious" : formData.ambition[0] === "4" ? "veryAmbitious" : "visionary"}`,
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{t("simulator.nextgen.ambition")}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-dashed">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <p
                      className="text-sm text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: t("simulator.nextgen.previewNote") }}
                    />
                  </div>
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
                    <h3 className="text-xl font-bold mb-2">{t("simulator.nextgen.unlockCareerPlan")}</h3>
                    <p className="text-muted-foreground">{t("simulator.nextgen.unlockDesc")}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button asChild variant="outline" size="lg" className="text-base hover:text-white">
                      <Link href="/#parcours">
                        {t("simulator.common.completePathway")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" className="text-base">
                      <Link href="/auth/register">
                        {t("simulator.common.createFreeAccount")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-center gap-6 pt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-muted-foreground">{t("simulator.common.free")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-muted-foreground">{t("simulator.common.noCommitment")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-muted-foreground">{t("simulator.common.immediateAccess")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button variant="ghost" onClick={handleBack} className="hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("simulator.modifyAnswers")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
