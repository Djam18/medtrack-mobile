import { Platform } from 'react-native';
import { Medication, DoseLog } from '../types/medication';

// Google Fit integration — Android only
// Uses react-native-fitness (community package)

let Fitness: any = null;

async function getFitness() {
  if (Platform.OS !== 'android') return null;
  if (Fitness) return Fitness;

  try {
    const module = await import('react-native-fitness');
    Fitness = module.default;
    return Fitness;
  } catch {
    return null;
  }
}

export async function requestGoogleFitPermissions(): Promise<boolean> {
  const fit = await getFitness();
  if (!fit) return false;

  try {
    const authorized = await fit.isAuthorized([
      fit.DataType.STEP_COUNT_DELTA,
      fit.DataType.ACTIVITY_SEGMENT,
    ]);

    if (!authorized) {
      await fit.authorize([
        fit.DataType.STEP_COUNT_DELTA,
        fit.DataType.ACTIVITY_SEGMENT,
      ]);
    }

    return true;
  } catch {
    return false;
  }
}

export async function getGoogleFitStepCount(date: string): Promise<number | null> {
  const fit = await getFitness();
  if (!fit) return null;

  try {
    const startDate = new Date(date + 'T00:00:00');
    const endDate = new Date(date + 'T23:59:59');

    const result = await fit.getSteps(startDate, endDate);
    return result?.value ?? null;
  } catch {
    return null;
  }
}

// Log a medication intake as an "activity" in Google Fit
export async function logMedicationToGoogleFit(
  medication: Medication,
  doseLog: DoseLog
): Promise<boolean> {
  const fit = await getFitness();
  if (!fit) return false;
  if (!doseLog.takenAt) return false;

  try {
    // Google Fit doesn't have a native medication type
    // Log as a light activity (metadata carries medication info)
    const startTime = new Date(doseLog.takenAt);
    const endTime = new Date(doseLog.takenAt + 60 * 1000);  // 1 minute

    await fit.saveActivity({
      startDate: startTime.toISOString(),
      endDate: endTime.toISOString(),
      activityType: fit.Activities.LIGHT,
      name: `MedTrack: ${medication.name} ${medication.dosage}${medication.unit}`,
    });

    return true;
  } catch {
    return false;
  }
}

// Get platform-appropriate health data
export async function getStepsForDate(date: string): Promise<number | null> {
  return getGoogleFitStepCount(date);
}

export const isGoogleFitAvailable = Platform.OS === 'android';
