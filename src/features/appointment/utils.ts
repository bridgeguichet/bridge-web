import { format, isAfter, isBefore, isToday, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

import type { CounselorAvailability, TimeSlot } from "./types";

/**
 * Default counselor availability configuration
 * Monday-Friday, 9:00-17:00, 30-minute slots
 */
export const DEFAULT_AVAILABILITY: CounselorAvailability = {
  dayOfWeek: 1,
  startHour: 9,
  endHour: 17,
  slotDurationMinutes: 30,
  unavailableDates: [],
};

/**
 * Check if a date is available for booking
 * @param date - Date to check
 * @param availability - Counselor availability configuration
 * @returns boolean indicating if date is available
 */
export function isDateAvailable(date: Date, availability: CounselorAvailability = DEFAULT_AVAILABILITY): boolean {
  const today = startOfDay(new Date());
  const checkDate = startOfDay(date);

  if (isBefore(checkDate, today)) {
    return false;
  }

  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }

  const dateString = format(date, "yyyy-MM-dd");
  if (availability.unavailableDates?.includes(dateString)) {
    return false;
  }

  return true;
}

/**
 * Generate time slots for a given date
 * @param date - Date to generate slots for
 * @param availability - Counselor availability configuration
 * @returns Array of time slots
 */
export function generateTimeSlots(date: Date, availability: CounselorAvailability = DEFAULT_AVAILABILITY): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const { startHour, endHour, slotDurationMinutes } = availability;

  const now = new Date();
  const isSelectedToday = isToday(date);

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDurationMinutes) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, minute, 0, 0);

      const timeString = format(slotTime, "HH:mm");
      const slotId = `${format(date, "yyyy-MM-dd")}-${timeString}`;

      let available = true;
      if (isSelectedToday && isBefore(slotTime, now)) {
        available = false;
      }

      slots.push({
        id: slotId,
        time: timeString,
        available,
        counselor: "Conseiller Bridge",
      });
    }
  }

  return slots;
}

/**
 * Format date for display
 * @param date - Date to format
 * @returns Formatted date string in French
 */
export function formatAppointmentDate(date: Date): string {
  return format(date, "EEEE d MMMM yyyy", { locale: fr });
}

/**
 * Get disabled dates matcher for Calendar component
 * Disables weekends and past dates
 */
export function getDisabledDatesMatcher(availability: CounselorAvailability = DEFAULT_AVAILABILITY) {
  return (date: Date) => {
    return !isDateAvailable(date, availability);
  };
}
