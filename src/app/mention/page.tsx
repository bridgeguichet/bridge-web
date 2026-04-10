"use client";

import React from "react";

import { Building2, Copyright, Info, Server } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MentionPage() {
  const { t } = useTranslation();

  const sections = [
    { id: "informations", icon: Building2 },
    { id: "hebergement", icon: Server },
    { id: "propriete", icon: Copyright },
    { id: "nature", icon: Info },
  ];

  const renderSectionContent = (sectionId: string) => {
    const section = t(`mentionPage.sections.${sectionId}`, { returnObjects: true }) as any;

    return (
      <div className="space-y-4">
        {section.intro && <p className="text-muted-foreground">{section.intro}</p>}
        {section.company && <p className="font-semibold text-foreground text-lg">{section.company}</p>}
        {section.text && <p className="text-muted-foreground">{section.text}</p>}

        {section.details && (
          <ul className="space-y-2 text-muted-foreground">
            {section.details.map((item: string, idx: number) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        )}

        {section.highlight && <p className="font-semibold text-foreground mt-4">{section.highlight}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-secondary py-20 text-white md:py-24">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
            {t("mentionPage.heroLabel")}
          </p>
          <h1 className="mb-6 font-[batangas] text-4xl font-bold md:text-6xl">{t("mentionPage.heroTitle")}</h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            {t("mentionPage.heroDesc")}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto max-w-4xl px-6">
          <nav className="mb-12 rounded-2xl border border-border bg-muted/30 p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">{t("mentionPage.tableOfContents")}</h2>
            <ul className="space-y-2">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-muted-foreground hover:text-primary flex items-center text-sm transition-colors"
                  >
                    <span className="mr-3 font-medium">{index + 1}.</span>
                    {t(`mentionPage.sections.${section.id}.title`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-12">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <article key={section.id} id={section.id} className="scroll-mt-8">
                  <div className="mb-6 flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                        {index + 1}. {t(`mentionPage.sections.${section.id}.title`)}
                      </h2>
                    </div>
                  </div>
                  <div className="pl-16">{renderSectionContent(section.id)}</div>
                </article>
              );
            })}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-muted/30 p-8">
            <h3 className="mb-4 text-xl font-semibold text-foreground">{t("mentionPage.contact.title")}</h3>
            <p className="mb-4 text-muted-foreground">{t("mentionPage.contact.description")}</p>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">{t("mentionPage.contact.email")}:</strong>{" "}
                {t("mentionPage.contact.emailDescription")}
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">{t("mentionPage.contact.address")}:</strong>{" "}
                {t("mentionPage.contact.addressDetails")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
