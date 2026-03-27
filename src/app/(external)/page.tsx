"use client";

import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  Calculator,
  ClipboardList,
  Coffee,
  Globe,
  Plane,
  Sparkles,
  TrendingUp,
  WalletCards,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import Footer from "@/external-components/footer";
import { HeroHeader } from "@/external-components/header";

import { cn } from "@/lib/utils";

const parcoursList = [
  {
    id: "diaspora",
    title: "Diaspora",
    description:
      "Vous êtes d'origine congolaise et vivez à l'étranger ? Découvrez des services sur-mesure pour vous.",
    icon: Globe,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    bgGradient: "from-blue-500/10 via-transparent to-transparent",
    bgHover: "hover:bg-blue-500/5",
    borderHover: "hover:border-blue-500/50",
    badge: "Populaire",
    badgeVariant: "default" as const,
  },
  {
    id: "expat",
    title: "Expatrié",
    description: "Vous venez vous installer au Congo ? Facilitez votre intégration et votre quotidien.",
    icon: Plane,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
    bgGradient: "from-emerald-500/10 via-transparent to-transparent",
    bgHover: "hover:bg-emerald-500/5",
    borderHover: "hover:border-emerald-500/50",
    badge: null,
    badgeVariant: null,
  },
  {
    id: "investisseur",
    title: "Investisseur",
    description: "Saisissez les meilleures opportunités d'investissement et développez vos projets.",
    icon: TrendingUp,
    color: "text-purple-500",
    bgColor: "bg-purple-500",
    bgGradient: "from-purple-500/10 via-transparent to-transparent",
    bgHover: "hover:bg-purple-500/5",
    borderHover: "hover:border-purple-500/50",
    badge: "Premium",
    badgeVariant: "secondary" as const,
  },
  {
    id: "nextgen",
    title: "NextGen (18-26 ans)",
    description: "Les services pour propulser la nouvelle génération vers l'avenir de leurs ambitions.",
    icon: Zap,
    color: "text-amber-500",
    bgColor: "bg-amber-500",
    bgGradient: "from-amber-500/10 via-transparent to-transparent",
    bgHover: "hover:bg-amber-500/5",
    borderHover: "hover:border-amber-500/50",
    badge: "Nouveau",
    badgeVariant: "outline" as const,
  },
  {
    id: "retraite",
    title: "Retraite",
    description: "Préparez sereinement votre avenir ou profitez de vos vieux jours en toute tranquillité.",
    icon: Coffee,
    color: "text-rose-500",
    bgColor: "bg-rose-500",
    bgGradient: "from-rose-500/10 via-transparent to-transparent",
    bgHover: "hover:bg-rose-500/5",
    borderHover: "hover:border-rose-500/50",
    badge: null,
    badgeVariant: null,
  },
];

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pt-24 pb-10 sm:px-6 sm:pt-28 sm:pb-14">
        <section className="relative isolate grid gap-8 overflow-hidden px-0 py-6 sm:grid-cols-12 sm:py-10">
          <div className="order-1 flex flex-col justify-center sm:order-1 sm:col-span-6">
            <p className="font-semibold text-muted-secondary text-xs tracking-wide">
              {t("external-hero.minidescription")}
            </p>
            <TextEffect
              as="h1"
              preset="fade-in-blur"
              speedSegment={0.3}
              className="mt-3 text-balance font-semibold text-3xl tracking-tight sm:text-5xl"
            >
              {t("external-hero.title")}
            </TextEffect>
            <p className="mt-4 text-pretty text-muted-secondary text-sm leading-relaxed sm:text-base md:text-lg">
              {t("external-hero.description")}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-muted-foreground text-xs backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t("external-hero.feature1")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-muted-foreground text-xs backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t("external-hero.feature2")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-muted-foreground text-xs backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t("external-hero.feature3")}
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="rounded-3xl">
                <a href="#simulateur">{t("external-hero.ctaSimulation")}</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-3xl hover:text-background">
                <Link href="/dashboard">{t("external-hero.rejoindrePlateforme")}</Link>
              </Button>
            </div>
          </div>

          <div className="order-2 sm:order-2 sm:col-span-6">
            <div className="relative h-full w-full">
              <div className="aspect-4/3 w-full rounded-3xl bg-muted sm:aspect-5/4" />
            </div>
          </div>
        </section>

        <section
          id="simulateur"
          className="-ml-[50vw] -mr-[50vw] relative bg-primary/50 right-1/2 left-1/2 w-screen scroll-mt-28 sm:scroll-mt-32"
        >
          <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <div className="-z-10 pointer-events-none absolute inset-0 overflow-hidden">
              <div className="-left-24 -top-24 absolute size-72 rounded-full bg-primary/10 blur-3xl" />
              <div className="-bottom-24 -right-24 absolute size-72 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="mx-auto  max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/50 px-3 py-1 text-muted-foreground text-xs backdrop-blur">
                <Calculator className="size-4 text-primary" />
                {t("simulationSection.badge")}
              </div>
              <h2 className="mt-4 font-semibold text-2xl tracking-tight text-background sm:text-3xl">{t("simulationSection.title")}</h2>
            </div>

            <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3">
              <div className="group hover:-translate-y-0.5 rounded-2xl border bg-background p-4 transition-all duration-200 hover:border-primary/20 hover:bg-background/70 hover:shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{t("simulationSection.cards.resultTitle")}</p>
                    <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
                      {t("simulationSection.cards.resultDescription")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group hover:-translate-y-0.5 rounded-2xl border bg-background p-4 transition-all duration-200 hover:border-primary/20 hover:bg-background/70 hover:shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ClipboardList className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{t("simulationSection.cards.checklistTitle")}</p>
                    <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
                      {t("simulationSection.cards.checklistDescription")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group hover:-translate-y-0.5 rounded-2xl border bg-background p-4 transition-all duration-200 hover:border-primary/20 hover:bg-background/70 hover:shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <WalletCards className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{t("simulationSection.cards.planningTitle")}</p>
                    <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
                      {t("simulationSection.cards.planningDescription")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-background rounded-2xl border p-6 sm:mt-12 sm:grid sm:grid-cols-12 sm:gap-8 sm:p-10">
              <div className="sm:col-span-7">
                <p className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-muted-foreground text-xs backdrop-blur">
                  {t("simulationSection.final.badge")}
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {t("simulationSection.final.badgeSecondary")}
                </p>
                <h3 className="mt-4 font-semibold text-xl tracking-tight sm:text-2xl">
                  {t("simulationSection.final.title")}
                </h3>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed sm:text-base">
                  {t("simulationSection.final.description")}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Button
                    asChild
                    className="h-auto justify-center rounded-2xl py-3 font-medium hover:text-background text-sm sm:text-base"
                    variant="outline"
                  >
                    <Link href="/diaspora">{t("simulationSection.final.paths.diaspora")}</Link>
                  </Button>
                  <Button
                    asChild
                    className="h-auto justify-center rounded-2xl py-3 font-medium hover:text-background text-sm sm:text-base"
                    variant="outline"
                  >
                    <Link href="/expat">{t("simulationSection.final.paths.expat")}</Link>
                  </Button>
                  <Button
                    asChild
                    className="h-auto justify-center rounded-2xl py-3 font-medium hover:text-background text-sm sm:text-base"
                    variant="outline"
                  >
                    <Link href="/retraite">{t("simulationSection.final.paths.retraite")}</Link>
                  </Button>
                  <Button
                    asChild
                    className="h-auto justify-center rounded-2xl py-3 font-medium hover:text-background text-sm sm:text-base"
                    variant="outline"
                  >
                    <Link href="/investisseur">{t("simulationSection.final.paths.investisseur")}</Link>
                  </Button>
                  <Button
                    asChild
                    className="h-auto justify-center rounded-2xl py-3 font-medium hover:text-background text-sm sm:text-base"
                    variant="outline"
                  >
                    <Link href="/nextgen">{t("simulationSection.final.paths.nextgen")}</Link>
                  </Button>
                  <Button
                    className="h-auto justify-center rounded-2xl py-3 font-medium hover:text-background text-sm sm:text-base"
                    disabled
                    type="button"
                    variant="outline"
                  >
                    {t("simulationSection.final.paths.transitaire")}
                  </Button>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {t("simulationSection.final.note")}
                  </p>
                </div>
              </div>

              <div className="mt-8 sm:col-span-5 sm:mt-0 sm:flex">
                <div className="relative aspect-4/5 overflow-hidden rounded-3xl border sm:aspect-auto sm:min-h-[360px] sm:flex-1">
                  <Image
                    src="/media/image-fille.jpg"
                    alt="fille"
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="parcours"
          className="-ml-[50vw] -mr-[50vw] relative right-1/2 left-1/2 w-screen scroll-mt-28 sm:mt-12 sm:scroll-mt-32 sm:py-14"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <div className="flex flex-col gap-8 sm:gap-10">
              <div className="mx-auto max-w-3xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-muted-foreground text-xs backdrop-blur">
                  <Sparkles className="size-4 text-primary" />
                  <span>Trouvez votre parcours idéal</span>
                </div>

                <h2 className="mt-4 font-semibold text-2xl tracking-tight sm:text-3xl">Choisissez votre parcours</h2>

                <p className="mt-3 text-muted-foreground text-sm leading-relaxed sm:text-base">
                  Sélectionnez le profil qui vous correspond le mieux afin que nous puissions adapter votre expérience et vous
                  proposer les services les plus pertinents.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {parcoursList.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={`/${item.id}`}
                      className={cn(
                        "group relative overflow-hidden rounded-3xl border-2 bg-background transition-all duration-500 ease-out",
                        "hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/10",
                        item.bgHover,
                        item.borderHover,
                      )}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 opacity-0 transition-opacity duration-500 bg-linear-to-br group-hover:opacity-100",
                          item.bgGradient,
                        )}
                      />

                      <div className="relative z-10 p-6 sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className={cn(
                              "rounded-2xl border-2 bg-linear-to-br from-background to-muted/50 p-4 shadow-lg transition-all duration-300",
                              "group-hover:rotate-3 group-hover:scale-110",
                              item.color,
                            )}
                          >
                            <Icon className="h-9 w-9 transition-transform duration-300 group-hover:scale-110" />
                          </div>

                          {item.badge && (
                            <Badge variant={item.badgeVariant} className="shrink-0">
                              {item.badge}
                            </Badge>
                          )}
                        </div>

                        <p className="mt-6 font-semibold text-xl tracking-tight transition-colors group-hover:text-primary">
                          {item.title}
                        </p>
                        <p className="mt-3 text-muted-foreground text-sm leading-relaxed sm:text-base">
                          {item.description}
                        </p>

                        <div className="mt-6 flex items-center justify-between rounded-2xl bg-muted/50 p-4 transition-all duration-300 group-hover:bg-primary/10">
                          <span className="font-semibold text-muted-foreground text-sm transition-colors group-hover:text-primary">
                            Démarrer maintenant
                          </span>
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-all duration-700",
                          "group-hover:scale-150 group-hover:opacity-30",
                          item.bgColor,
                        )}
                      />
                      <div
                        className={cn(
                          "pointer-events-none absolute -top-16 -left-16 h-32 w-32 rounded-full opacity-0 blur-3xl transition-all duration-700",
                          "group-hover:scale-125 group-hover:opacity-20",
                          item.bgColor,
                        )}
                      />
                    </Link>
                  );
                })}
              </div>
              <Link href="/demo-appointment"> Test </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
