export type Frequency = 'daily' | 'twice-daily' | 'three-times-daily' | 'weekly' | 'as-needed';
export type DoseUnit = 'mg' | 'ml' | 'tablet' | 'capsule' | 'drop' | 'unit';

export interface Medication {
  id: string;
  name: string;
  dosage: number;
  unit: DoseUnit;
  frequency: Frequency;
  times: string[];  // ISO time strings, e.g. ['08:00', '20:00']
  notes: string;
  color: string;
  startDate: string;  // ISO date string
  endDate: string | null;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface DoseLog {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string;  // ISO datetime
  takenAt: number | null;  // timestamp when actually taken
  skipped: boolean;
  notes: string;
  date: string;  // YYYY-MM-DD
}

export type DoseStatus = 'pending' | 'taken' | 'skipped' | 'missed';

export interface DailyStats {
  date: string;
  total: number;
  taken: number;
  skipped: number;
  missed: number;
  adherenceRate: number;
}

export interface AdherenceStreak {
  currentStreak: number;
  longestStreak: number;
  lastMissedDate: string | null;
}
