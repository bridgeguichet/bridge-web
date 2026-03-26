"use client";

import { Calendar as CalendarIcon, Clock, User, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { AppointmentData } from "../types";
import { formatAppointmentDate } from "../utils";

interface AppointmentSummaryProps {
  appointment: AppointmentData;
  selectedServicesCount?: number;
  totalEstimate?: number;
}

export function AppointmentSummary({
  appointment,
  selectedServicesCount = 0,
  totalEstimate = 0,
}: AppointmentSummaryProps) {
  const { date, timeSlot } = appointment;
  const hasAppointment = date && timeSlot;

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Récapitulatif</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedServicesCount > 0 && (
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4" />
                <span>Services sélectionnés</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-sm">
                  {selectedServicesCount} service{selectedServicesCount > 1 ? "s" : ""}
                </Badge>
                {totalEstimate > 0 && (
                  <span className="font-bold text-lg text-primary">
                    ${totalEstimate.toFixed(0)}
                  </span>
                )}
              </div>
            </div>
            <Separator />
          </>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span>Rendez-vous conseiller</span>
          </div>

          {hasAppointment ? (
            <div className="space-y-3 p-3 rounded-lg bg-background border border-primary/20">
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-semibold text-sm capitalize">
                      {formatAppointmentDate(date)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Heure</p>
                    <p className="font-semibold text-sm">{timeSlot.time}</p>
                  </div>
                </div>
              </div>

              {timeSlot.counselor && (
                <>
                  <Separator />
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Conseiller</p>
                        <p className="font-semibold text-sm">{timeSlot.counselor}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center">
              <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">
                Sélectionnez une date et un créneau horaire
              </p>
            </div>
          )}
        </div>

        {hasAppointment && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Un email de confirmation vous sera envoyé après validation du paiement.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
