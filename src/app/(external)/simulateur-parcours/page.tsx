"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Coffee,
  FileText,
  Globe,
  Palmtree,
  Plane,
  Rocket,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

const pathwayOptions = [
  {
    id: "diaspora",
    labelKey: "simulator.pathways.diaspora",
    icon: Globe,
    color: "text-blue-500",
  },
  {
    id: "expat",
    labelKey: "simulator.pathways.expat",
    icon: Plane,
    color: "text-emerald-500",
  },
  {
    id: "investisseur",
    labelKey: "simulator.pathways.investor",
    icon: TrendingUp,
    color: "text-purple-500",
  },
  {
    id: "retraite",
    labelKey: "simulator.pathways.retirement",
    icon: Coffee,
    color: "text-rose-500",
  },
  {
    id: "nextgen",
    labelKey: "simulator.pathways.nextgen",
    icon: Rocket,
    color: "text-amber-500",
  },
];

export default function SimulateurParcours() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedPathway, setSelectedPathway] = useState("");

  const handleContinue = () => {
    if (selectedPathway) {
      router.push(`/simulateur-parcours/simulateur-${selectedPathway}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="-ml-[50vw] -mr-[50vw] relative right-1/2 left-1/2 w-screen">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("simulator.backToHome")}
            </Link>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-primary text-sm font-medium">{t("simulator.personalizedSimulation")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("simulator.selectYourPathway")}</h1>
            <div className="flex items-center justify-between mb-2">
              <Progress value={25} className="flex-1 mr-4" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {t("simulator.stepOf", { current: 1, total: 4 })}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <Card className="border-dashed">
              <CardContent className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-primary" />
                      <p className="text-3xl font-bold">+1 200</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{t("simulator.stats.peopleHelped")}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <p className="text-3xl font-bold">98%</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{t("simulator.stats.satisfactionRate")}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <p className="text-3xl font-bold">5</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{t("simulator.stats.specializedPathways")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("simulator.chooseProfile")}</CardTitle>
              <CardDescription>{t("simulator.selectBestMatch")}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPathway} onValueChange={setSelectedPathway}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pathwayOptions.map((pathway) => {
                    const Icon = pathway.icon;
                    return (
                      <div
                        key={pathway.id}
                        className={cn(
                          "relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          selectedPathway === pathway.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30",
                        )}
                        onClick={() => setSelectedPathway(pathway.id)}
                      >
                        <RadioGroupItem value={pathway.id} id={pathway.id} />
                        <Icon className={cn("w-6 h-6", pathway.color)} />
                        <Label htmlFor={pathway.id} className="flex-1 cursor-pointer font-medium">
                          {t(pathway.labelKey)}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>

              <div className="flex justify-end mt-6">
                <Button onClick={handleContinue} disabled={!selectedPathway} size="lg" className="min-w-[140px]">
                  {t("simulator.continue")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
