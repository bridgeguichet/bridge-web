"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/use-translation";
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
  const { t } = useTranslation();
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
            {t("simulator.backToPathways")}
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <Plane className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{t("simulator.expat.title")}</h1>
              <p className="text-muted-foreground">{t("simulator.expat.subtitle")}</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">{t("simulator.stepOf", { current: currentStep, total: 3 })}</p>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>{t("simulator.expat.contractType")}</CardTitle>
                <CardDescription>{t("simulator.expat.professionalSituation")}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.typeContrat} onValueChange={(value) => setFormData({ ...formData, typeContrat: value })}>
                  <div className="space-y-3">
                    {[
                      { value: "local", labelKey: "simulator.expat.contracts.local", icon: Building2 },
                      { value: "expat", labelKey: "simulator.expat.contracts.expatPackage", icon: Plane },
                      { value: "entrepreneur", labelKey: "simulator.expat.contracts.entrepreneur", icon: Briefcase },
                      { value: "mutation", labelKey: "simulator.expat.contracts.internalTransfer", icon: Users },
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
                <CardTitle>{t("simulator.expat.activitySector")}</CardTitle>
                <CardDescription>{t("simulator.expat.workDomain")}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.secteur} onValueChange={(value) => setFormData({ ...formData, secteur: value })}>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "ong", labelKey: "simulator.expat.sectors.ngo" },
                      { value: "mines", labelKey: "simulator.expat.sectors.mining" },
                      { value: "telecom", labelKey: "simulator.expat.sectors.telecom" },
                      { value: "finance", labelKey: "simulator.expat.sectors.finance" },
                      { value: "construction", labelKey: "simulator.expat.sectors.construction" },
                      { value: "autre", labelKey: "simulator.expat.sectors.other" },
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
                          {t(option.labelKey)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!formData.typeContrat || !formData.secteur} size="lg">
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
                <CardTitle>{t("simulator.expat.availableBudget")}</CardTitle>
                <CardDescription>{t("simulator.expat.globalEstimate")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-emerald-500">${formData.budget[0]}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("simulator.common.perMonth")}</p>
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
                <CardTitle>{t("simulator.expat.householdComposition")}</CardTitle>
                <CardDescription>{t("simulator.expat.peopleToSettle")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-emerald-500">{formData.familySize[0]}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("simulator.common.persons")}</p>
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
            <Card className="border-2 border-emerald-500/20">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500">{t("simulator.common.personalizedPreview")}</Badge>
                </div>
                <CardTitle>{t("simulator.expat.yourProfile")}</CardTitle>
                <CardDescription>{t("simulator.common.basedOnAnswers")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-center">
                    <DollarSign className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-500">${formData.budget[0]}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("simulator.common.monthlyBudget")}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-center">
                    <Briefcase className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-500 capitalize">{formData.typeContrat}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("simulator.expat.contractType")}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20 text-center">
                    <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-500">{formData.familySize[0]}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("simulator.common.persons")}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-dashed">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t("simulator.expat.previewNote") }} />
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
                    <h3 className="text-xl font-bold mb-2">{t("simulator.expat.unlockPackage")}</h3>
                    <p className="text-muted-foreground">
                      {t("simulator.expat.unlockDesc")}
                    </p>
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