"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { AppointmentStep } from "@/features/appointment";
import type { AppointmentData } from "@/features/appointment";

/**
 * Demo page showing AppointmentStep component integration
 * This demonstrates how to integrate the appointment booking step
 * into any user journey (Diaspora, Expat, Investor, NextGen, Retraite)
 *
 * Access at: /demo-appointment
 */
export default function DemoAppointmentPage() {
  const [appointment, setAppointment] = useState<AppointmentData>({
    date: undefined,
    timeSlot: undefined,
  });

  const mockSelectedServicesCount = 5;
  const mockTotalEstimate = 1800;

  const isAppointmentComplete =
    appointment.date !== undefined && appointment.timeSlot !== undefined;

  const handleProceedToPayment = () => {
    console.log("Proceeding to payment with appointment:", appointment);
    alert(
      `Rendez-vous confirmé!\nDate: ${appointment.date?.toLocaleDateString("fr-FR")}\nHeure: ${appointment.timeSlot?.time}`,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8" />
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Démo - Étape 8/9
          </div>
          <h1 className="text-3xl font-bold">
            Démonstration du composant de réservation
          </h1>
          <p className="text-muted-foreground text-lg">
            Cette page montre l'intégration du composant AppointmentStep dans un parcours
            utilisateur.
          </p>
        </div>

        <AppointmentStep
          onAppointmentChange={setAppointment}
          selectedServicesCount={mockSelectedServicesCount}
          totalEstimate={mockTotalEstimate}
        />

        <div className="mt-8 flex items-center justify-between gap-4 p-6 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/5">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">État de la sélection</p>
            <p className="font-medium">
              {isAppointmentComplete
                ? "✅ Rendez-vous sélectionné - Prêt pour le paiement"
                : "⏳ Sélectionnez une date et un créneau horaire"}
            </p>
            {appointment.date && appointment.timeSlot && (
              <p className="text-sm text-muted-foreground mt-2">
                Rendez-vous: {appointment.date.toLocaleDateString("fr-FR")} à{" "}
                {appointment.timeSlot.time}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Button
              onClick={handleProceedToPayment}
              disabled={!isAppointmentComplete}
              className="gap-2"
            >
              Procéder au paiement
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mt-12 p-6 rounded-lg bg-muted/50 border">
          <h2 className="text-lg font-semibold mb-3">💡 Notes d'intégration</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • Ce composant s'intègre comme <strong>étape 8</strong> (après la sélection de
              services, avant le paiement)
            </li>
            <li>
              • Les données de rendez-vous sont passées à l'étape de paiement via{" "}
              <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">
                onAppointmentChange
              </code>
            </li>
            <li>
              • La disponibilité est simulée (lun-ven, 9h-17h, créneaux de 30 min) - prête pour
              l'intégration backend
            </li>
            <li>
              • Le composant est entièrement responsive et suit le design system existant
            </li>
            <li>
              • Consultez{" "}
              <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">
                APPOINTMENT_BOOKING_GUIDE.md
              </code>{" "}
              pour la documentation complète
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
