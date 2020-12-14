import { Medication, DoseLog, Frequency } from '../types/medication';

// Build dose schedule for a given date based on medication frequency
export function buildDailySchedule(medications: Medication[], date: string): DoseLog[] {
  const doses: DoseLog[] = [];

  for (const med of medications) {
    if (!med.isActive) continue;
    if (med.endDate && med.endDate < date) continue;
    if (med.startDate > date) continue;

    const times = getTimesForFrequency(med.frequency, med.times);

    for (const time of times) {
      const scheduledTime = `${date}T${time}:00`;
      doses.push({
        id: `${med.id}-${date}-${time}`,
        medicationId: med.id,
        medicationName: med.name,
        scheduledTime,
        takenAt: null,
        skipped: false,
        notes: '',
        date,
      });
    }
  }

  // Sort by scheduled time
  return doses.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
}

function getTimesForFrequency(frequency: Frequency, customTimes: string[]): string[] {
  if (customTimes.length > 0) return customTimes;

  switch (frequency) {
    case 'daily':
      return ['08:00'];
    case 'twice-daily':
      return ['08:00', '20:00'];
    case 'three-times-daily':
      return ['08:00', '14:00', '20:00'];
    case 'weekly':
      return ['08:00'];
    case 'as-needed':
      return [];
    default:
      return ['08:00'];
  }
}

// Check if a medication should be taken on a given weekday (for weekly dosing)
export function shouldTakeOnDate(medication: Medication, date: string): boolean {
  if (medication.frequency !== 'weekly') return true;

  const startDay = new Date(medication.startDate + 'T12:00:00').getDay();
  const targetDay = new Date(date + 'T12:00:00').getDay();
  return startDay === targetDay;
}

// Calculate adherence rate for a date range
export function calculateAdherence(
  logs: DoseLog[],
  startDate: string,
  endDate: string
): number {
  const filtered = logs.filter(l => l.date >= startDate && l.date <= endDate);
  if (filtered.length === 0) return 0;

  const taken = filtered.filter(l => l.takenAt !== null).length;
  return Math.round((taken / filtered.length) * 100);
}

// Get upcoming doses in the next N hours
export function getUpcomingDoses(doses: DoseLog[], hoursAhead: number): DoseLog[] {
  const now = new Date();
  const cutoff = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

  return doses.filter(dose => {
    if (dose.takenAt !== null || dose.skipped) return false;
    const scheduled = new Date(dose.scheduledTime);
    return scheduled >= now && scheduled <= cutoff;
  });
}
