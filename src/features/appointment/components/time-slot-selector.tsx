"use client";

import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TimeSlot } from "../types";
import { useTranslation } from "@/lib/i18n/use-translation";

interface TimeSlotSelectorProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | undefined;
  onSelectSlot: (slot: TimeSlot) => void;
}

export function TimeSlotSelector({
  slots,
  selectedSlot,
  onSelectSlot,
}: TimeSlotSelectorProps) {
  const { t } = useTranslation();
  
  const morningSlots = slots.filter((slot) => {
    const hour = Number.parseInt(slot.time.split(":")[0]);
    return hour < 12;
  });

  const afternoonSlots = slots.filter((slot) => {
    const hour = Number.parseInt(slot.time.split(":")[0]);
    return hour >= 12;
  });

  const renderSlotGroup = (groupSlots: TimeSlot[], title: string) => {
    if (groupSlots.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-medium text-sm text-muted-foreground">{title}</h4>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {groupSlots.map((slot) => (
            <Button
              key={slot.id}
              variant={selectedSlot?.id === slot.id ? "default" : "outline"}
              size="sm"
              disabled={!slot.available}
              onClick={() => onSelectSlot(slot)}
              className={cn(
                "h-auto py-2 px-3 flex flex-col items-center justify-center transition-all",
                selectedSlot?.id === slot.id &&
                  "ring-2 ring-primary ring-offset-2",
                !slot.available && "opacity-40 cursor-not-allowed",
              )}
            >
              <span className="font-semibold text-sm">{slot.time}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{t("appointment.availableSlots")}</h3>
        <Badge variant="secondary" className="gap-1.5">
          <Clock className="w-3 h-3" />
          {slots.filter((s) => s.available).length} {t("appointment.available")}
        </Badge>
      </div>

      {renderSlotGroup(morningSlots, t("appointment.morning"))}
      {renderSlotGroup(afternoonSlots, t("appointment.afternoon"))}

      {slots.filter((s) => s.available).length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">{t("appointment.noSlotsAvailable")}</p>
        </div>
      )}
    </div>
  );
}
