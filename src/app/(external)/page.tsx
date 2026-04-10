"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Calculator, Shield, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import Footer from "@/external-components/footer";
import { HeroHeader } from "@/external-components/header";
import { cn } from "@/lib/utils";

const getParcoursList = (_t: (key: string) => string) => [
  {
    id: "diaspora",
    image: "/media/image-diaspora.jpg",
    color: "text-blue-500",
    bgColor: "bg-rose-500",
    bgGradient: "from-rose-500/10 via-transparent to-transparent",
    bgHover: "hover:bg-rose-500/5",
    borderHover: "hover:border-rose-500/50",
    showBadge: true,
    badgeVariant: "default" as const,
  },
  {
    id: "expat",
    image: "/media/image-expat.jpg",
    color: "text-emerald-500",
    bgColor: "bg-rose-500",
    bgGradient: "from-rose-500/10 via-transparent to-transparent",
    bgHover: "hover:bg-rose-500/5",
    borderHover: "hover:border-rose-500/50",
    showBadge: false,
    badgeVariant: null,
  },
  {
    id: "investisseur",
    image: "/media/image-invest.jpg",
    color: "text-purple-500",
    bgColor: "bg-rose-500",
    bgGradient: "from-rose-500/10 via-transparent to-transparent",
    bgHover: "hover:bg-rose-500/5",
    borderHover: "hover:border-rose-500/50",
    showBadge: false,
    badgeVariant: null,
  },
  {
    id: "nextgen",
    image: "/media/image-nextgen.jpg",
    color: "text-amber-500",
    bgColor: "bg-rose-500",
    bgGradient: "from-rose-500/10 via-transparent to-transparent",
    bgHover: "hover:bg-rose-500/5",
    borderHover: "hover:border-rose-500/50",
    showBadge: false,
    badgeVariant: null,
  },
  {
    id: "retraite",
    image: "/media/image-retraite.jpg",
    color: "text-rose-500",
    bgColor: "bg-rose-500",
    bgGradient: "from-rose-500/10 via-transparent to-transparent",
    bgHover: "hover:bg-rose-500/5",
    borderHover: "hover:border-rose-500/50",
    showBadge: false,
    badgeVariant: null,
  },
];

export default function ExternalPage() {
  const { t, i18n } = useTranslation();
  const parcoursList = getParcoursList(t);
  const imageSrc = i18n.language === "en" ? "/media/simulateur-etape1_en.png" : "/media/simulateur-etape1.png";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pt-24 pb-10 sm:px-6 sm:pt-28 sm:pb-14">
        <section className="relative isolate overflow-hidden px-0 py-6 sm:py-10">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
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

            <div className="mt-7 flex flex-wrap justify-center gap-2">
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
                <Link href="/auth/register">{t("external-hero.rejoindrePlateforme")}</Link>
              </Button>
            </div>

            <div className="relative mt-12 w-full px-2 sm:px-4 md:px-0">
              <Image
                src={imageSrc}
                alt="Simulateur Bridge - Étape 1"
                width={1200}
                height={800}
                className="w-full rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] sm:shadow-[0_10px_40px_rgb(0,0,0,0.15)] md:shadow-2xl"
                priority
              />
            </div>
          </div>
        </section>

        <section
          id="simulateur"
          className="-ml-[50vw] -mr-[50vw] relative right-1/2 left-1/2 w-screen scroll-mt-28 bg-primary/10 sm:scroll-mt-32"
        >
          <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <div className="-z-10 pointer-events-none absolute inset-0 overflow-hidden">
              <div className="-left-32 absolute top-0 size-96 rounded-full bg-accent/5 blur-3xl" />
              <div className="-right-32 absolute bottom-0 size-96 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-background/80 px-4 py-1.5 font-medium text-accent text-xs backdrop-blur-sm">
                <Calculator className="size-3.5" />
                {t("simulationSection.badge")}
              </div>
              <h2 className="mt-6 font-bold text-2xl tracking-tight sm:text-3xl lg:text-4xl">
                {t("simulationSection.title")}
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-muted-foreground text-sm leading-relaxed">
                {t("simulationSection.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-6">
                <div className="group flex gap-5">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-accent/10 transition-transform group-hover:scale-110" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent font-bold text-background text-xl shadow-accent/20 shadow-lg">
                      1
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="mb-2 font-bold text-foreground text-lg">
                      {t("simulationSection.steps.step1.title")}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t("simulationSection.steps.step1.description")}
                    </p>
                  </div>
                </div>

                <div className="group flex gap-5">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-accent/10 transition-transform group-hover:scale-110" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent font-bold text-background text-xl shadow-accent/20 shadow-lg">
                      2
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="mb-2 font-bold text-foreground text-lg">
                      {t("simulationSection.steps.step2.title")}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t("simulationSection.steps.step2.description")}
                    </p>
                  </div>
                </div>

                <div className="group flex gap-5">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-accent/10 transition-transform group-hover:scale-110" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent font-bold text-background text-xl shadow-accent/20 shadow-lg">
                      3
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="mb-2 font-bold text-foreground text-lg">
                      {t("simulationSection.steps.step3.title")}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t("simulationSection.steps.step3.description")}
                    </p>
                  </div>
                </div>

                <div className="group flex gap-5">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-accent/10 transition-transform group-hover:scale-110" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent font-bold text-background text-xl shadow-accent/20 shadow-lg">
                      4
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="mb-2 font-bold text-foreground text-lg">
                      {t("simulationSection.steps.step4.title")}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t("simulationSection.steps.step4.description")}
                    </p>
                  </div>
                </div>

                <div className="relative mt-10 pt-8">
                  <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
                  <Button
                    asChild
                    size="lg"
                    className="group h-14 w-full font-semibold text-base shadow-lg shadow-primary/10 transition-all hover:shadow-primary/20 hover:shadow-xl"
                  >
                    <Link href="/simulateur-parcours">
                      {t("simulationSection.cta.button")}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-muted-foreground text-xs">
                    <Shield className="h-3.5 w-3.5 text-accent" />
                    {t("simulationSection.cta.note")}
                  </p>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="sticky top-24">
                  <div className="relative">
                    <div className="-inset-4 absolute rounded-3xl bg-linear-to-br from-accent/20 to-primary/20 blur-2xl" />
                    <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-accent/10 shadow-2xl">
                      <Image
                        src="/media/image-fille.jpg"
                        alt="Simulation personnalisée"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
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
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-muted-foreground text-xs backdrop-blur">
                  <Sparkles className="size-4 text-primary" />
                  <span>{t("parcoursPage.badge")}</span>
                </div>

                <h2 className="font-bold text-2xl tracking-tight sm:text-3xl lg:text-4xl">{t("parcoursPage.title")}</h2>

                <p className="mt-3 text-muted-foreground text-sm leading-relaxed sm:text-base">
                  {t("parcoursPage.description")}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {parcoursList.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${item.id}`}
                    className={cn(
                      "group relative overflow-hidden rounded-3xl border-2 bg-background transition-all duration-500 ease-out",
                      "hover:-translate-y-1 hover:scale-[1.01] hover:shadow-primary/10 hover:shadow-xl",
                      item.bgHover,
                      item.borderHover,
                    )}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                        item.bgGradient,
                      )}
                    />

                    <div className="relative z-10 p-6 sm:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className={cn(
                            "relative h-28 w-28 overflow-hidden rounded-2xl border-2 shadow-lg transition-all duration-300 sm:h-32 sm:w-32",
                            "group-hover:rotate-3 group-hover:scale-110",
                          )}
                        >
                          <Image
                            src={item.image}
                            alt={t(`parcoursPage.parcours.${item.id}.title`)}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 640px) 112px, 128px"
                          />
                        </div>

                        {item.showBadge && (
                          <Badge variant={item.badgeVariant} className="shrink-0">
                            {t("parcoursPage.popular")}
                          </Badge>
                        )}
                      </div>

                      <p className="mt-6 font-semibold text-xl tracking-tight transition-colors group-hover:text-primary">
                        {t(`parcoursPage.parcours.${item.id}.title`)}
                      </p>
                      <p className="mt-3 text-muted-foreground text-sm leading-relaxed sm:text-base">
                        {t(`parcoursPage.parcours.${item.id}.description`)}
                      </p>

                      <div className="mt-6 flex items-center justify-between rounded-2xl bg-muted/50 p-4 transition-all duration-300 group-hover:bg-primary/10">
                        <span className="font-semibold text-muted-foreground text-sm transition-colors group-hover:text-primary">
                          {t("parcoursPage.startNow")}
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "-bottom-16 -right-16 pointer-events-none absolute h-40 w-40 rounded-full opacity-0 blur-3xl transition-all duration-700",
                        "group-hover:scale-150 group-hover:opacity-30",
                        item.bgColor,
                      )}
                    />
                    <div
                      className={cn(
                        "-top-16 -left-16 pointer-events-none absolute h-32 w-32 rounded-full opacity-0 blur-3xl transition-all duration-700",
                        "group-hover:scale-125 group-hover:opacity-20",
                        item.bgColor,
                      )}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
