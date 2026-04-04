"use client";

import { useState, useMemo } from "react";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TimeSlotSelector } from "./time-slot-selector";
import { AppointmentSummary } from "./appointment-summary";
import type { AppointmentData, TimeSlot } from "../types";
import { generateTimeSlots, getDisabledDatesMatcher } from "../utils";
import { useTranslation } from "@/lib/i18n/use-translation";

interface AppointmentStepProps {
  /**
   * Callback when appointment selection changes
   * Used to pass appointment data to parent component for payment step
   */
  onAppointmentChange?: (appointment: AppointmentData) => void;

  /**
   * Number of selected services (for summary display)
   */
  selectedServicesCount?: number;

  /**
   * Total estimate of selected services (for summary display)
   */
  totalEstimate?: number;

  /**
   * Custom title for the step
   */
  title?: string;

  /**
   * Custom description for the step
   */
  description?: string;
}

/**
 * AppointmentStep Component
 *
 * Reusable appointment booking component for all user journeys.
 * This step appears AFTER services selection and BEFORE payment.
 *
 * Features:
 * - Calendar date selection (weekdays only, no past dates)
 * - Time slot selection (30-min slots, 9:00-17:00)
 * - Real-time availability checking
 * - Summary sidebar with appointment details
 * - Responsive layout (stacks on mobile)
 *
 * Usage:
 * ```tsx
 * const [appointment, setAppointment] = useState<AppointmentData>({
 *   date: undefined,
 *   timeSlot: undefined,
 * });
 *
 * <AppointmentStep
 *   onAppointmentChange={setAppointment}
 *   selectedServicesCount={5}
 *   totalEstimate={1200}
 * />
 * ```
 */
export function AppointmentStep({
  onAppointmentChange,
  selectedServicesCount = 0,
  totalEstimate = 0,
  title,
  description,
}: AppointmentStepProps) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | undefined>(undefined);

  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return generateTimeSlots(selectedDate);
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot(undefined);

    if (onAppointmentChange) {
      onAppointmentChange({
        date,
        timeSlot: undefined,
      });
    }
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);

    if (onAppointmentChange) {
      onAppointmentChange({
        date: selectedDate,
        timeSlot: slot,
      });
    }
  };

  const disabledMatcher = getDisabledDatesMatcher();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{title || t("appointment.title")}</h2>
        <p className="text-muted-foreground">{description || t("appointment.description")}</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {t("appointment.alert")}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {t("appointment.chooseDate")}
              </CardTitle>
              <CardDescription>
                {t("appointment.chooseDateDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={disabledMatcher}
                className="rounded-md border"
                fromDate={new Date()}
              />
            </CardContent>
          </Card>

          {selectedDate && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <CardHeader>
                <CardTitle>{t("appointment.chooseTimeSlot")}</CardTitle>
                <CardDescription>
                  {t("appointment.chooseTimeSlotDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimeSlotSelector
                  slots={timeSlots}
                  selectedSlot={selectedTimeSlot}
                  onSelectSlot={handleTimeSlotSelect}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <AppointmentSummary
              appointment={{
                date: selectedDate,
                timeSlot: selectedTimeSlot,
              }}
              selectedServicesCount={selectedServicesCount}
              totalEstimate={totalEstimate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
