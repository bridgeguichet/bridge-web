"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, CheckCircle2 } from "lucide-react";

<<<<<<< HEAD
import Footer from "@/components/footer";
import { HeroHeader } from "@/components/header";
=======
>>>>>>> backup-plan
import { Button } from "@/components/ui/button";
import { AppointmentStep } from "@/features/appointment";
import type { AppointmentData } from "@/features/appointment";
import { formatAppointmentDate } from "@/features/appointment";

export default function RendezVousPage() {
  const router = useRouter();
  const [appointment, setAppointment] = useState<AppointmentData>({
    date: undefined,
    timeSlot: undefined,
  });
  const [confirmed, setConfirmed] = useState(false);

  const isComplete = !!appointment.date && !!appointment.timeSlot;

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Page header */}
        <div className="border-gray-200 border-b bg-white">
          <div className="container mx-auto px-6 py-5 lg:px-8">
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                className="gap-2 bg-transparent text-secondary hover:text-primary hover:bg-transparent"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <div className="h-5 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 text-lg leading-tight">Prendre rendez-vous</h1>
                  <p className="text-gray-400 text-xs">avec un conseiller Bridge</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12 lg:px-8">
          {confirmed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-lg text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <h2 className="mb-3 font-bold text-2xl text-gray-900">Rendez-vous confirmé !</h2>
              <p className="mb-2 text-gray-500">
                Votre rendez-vous avec un conseiller Bridge a bien été enregistré.
              </p>
              {appointment.date && appointment.timeSlot && (
                <div className="my-6 rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">
                        {formatAppointmentDate(appointment.date)}
                      </p>
                      <p className="text-gray-500 text-sm">à {appointment.timeSlot.time}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs">
                    Un email de confirmation vous sera envoyé avec tous les détails.
                  </p>
                </div>
              )}
              <Button onClick={() => router.push("/")} className="mt-2">
                Retour à l&apos;accueil
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-4xl space-y-8"
            >
              <div className="text-center">
                <h2 className="font-bold text-3xl text-gray-900">Choisissez votre créneau</h2>
                <p className="mt-2 text-gray-500">
                  Sélectionnez une date et un horaire pour votre rendez-vous avec un conseiller Bridge.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <AppointmentStep onAppointmentChange={setAppointment} />
              </div>

              <div className="flex justify-end">
                <Button
                  size="lg"
                  disabled={!isComplete}
                  onClick={handleConfirm}
                  className="gap-2 px-8"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Confirmer le rendez-vous
                </Button>
              </div>
            </motion.div>
          )}
        </div>
    </div>
  );
}
