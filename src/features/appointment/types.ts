export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  counselor?: string;
}

export interface AppointmentData {
  date: Date | undefined;
  timeSlot: TimeSlot | undefined;
}

export interface CounselorAvailability {
  dayOfWeek: number;
  startHour: number;
  endHour: number;
  slotDurationMinutes: number;
  unavailableDates?: string[];
}
