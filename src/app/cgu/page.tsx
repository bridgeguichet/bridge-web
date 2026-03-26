"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { FileText, Shield, Users, Scale, Briefcase, Ban, CheckCircle, AlertTriangle } from "lucide-react";

export default function CGUPage() {
  const { t } = useTranslation();

  const sections = [
    { id: "objet", icon: FileText },
    { id: "nature", icon: Briefcase },
    { id: "responsabilite", icon: Scale },
    { id: "partenaires", icon: Users },
    { id: "antiContournement", icon: Shield },
    { id: "clausePenale", icon: AlertTriangle },
    { id: "remboursement", icon: Ban },
    { id: "conformite", icon: CheckCircle },
    { id: "conformiteInter", icon: Shield },
    { id: "fraude", icon: AlertTriangle },
    { id: "confidentialite", icon: FileText },
    { id: "forceMajeure", icon: AlertTriangle },
    { id: "resiliation", icon: Ban },
    { id: "droitApplicable", icon: Scale },
    { id: "acceptation", icon: CheckCircle },
  ];

  const renderSectionContent = (sectionId: string) => {
    const section = t(`cguPage.sections.${sectionId}`, { returnObjects: true }) as any;
    
    return (
      <div className="space-y-4">
        {section.intro && <p className="text-muted-foreground">{section.intro}</p>}
        {section.text && <p className="text-muted-foreground">{section.text}</p>}
        {section.text1 && <p className="text-muted-foreground">{section.text1}</p>}
        {section.text2 && <p className="text-muted-foreground">{section.text2}</p>}
        
        {section.subtitle && (
          <p className="font-semibold text-foreground mt-4">{section.subtitle}</p>
        )}
        
        {section.list && (
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            {section.list.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
        
        {section.noGuarantee && (
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            {section.noGuarantee.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
        
        {section.penalty && (
          <p className="text-muted-foreground ml-6">• {section.penalty}</p>
        )}
        
        {section.duration && (
          <p className="text-muted-foreground mt-4">{section.duration}</p>
        )}
        
        {section.note && (
          <p className="text-muted-foreground mt-4">{section.note}</p>
        )}
        
        {section.highlight && (
          <p className="font-semibold text-foreground mt-4">{section.highlight}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-secondary py-20 text-white md:py-24">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
            {t("cguPage.heroLabel")}
          </p>
          <h1 className="mb-6 font-[batangas] text-4xl font-bold md:text-6xl">
            {t("cguPage.heroTitle")}
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            {t("cguPage.heroDesc")}
          </p>
          <p className="mt-4 text-sm text-white/60">
            {t("cguPage.lastUpdate")}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto max-w-4xl px-6">
          <nav className="mb-12 rounded-2xl border border-border bg-muted/30 p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              {t("cguPage.tableOfContents")}
            </h2>
            <ul className="space-y-2">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-muted-foreground hover:text-primary flex items-center text-sm transition-colors"
                  >
                    <span className="mr-3 font-medium">{index + 1}.</span>
                    {t(`cguPage.sections.${section.id}.title`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-12">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <article
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-8"
                >
                  <div className="mb-6 flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                        {t("cguPage.article")} {index + 1}. {t(`cguPage.sections.${section.id}.title`)}
                      </h2>
                    </div>
                  </div>
                  <div className="pl-16">
                    {renderSectionContent(section.id)}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-muted/30 p-8">
            <h3 className="mb-4 text-xl font-semibold text-foreground">
              {t("cguPage.contact.title")}
            </h3>
            <p className="mb-4 text-muted-foreground">
              {t("cguPage.contact.description")}
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">{t("cguPage.contact.email")}:</strong>{" "}
                {t("cguPage.contact.emailDescription")}
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">
                  {t("cguPage.contact.address")}:
                </strong>{" "}
                {t("cguPage.contact.addressDetails")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
