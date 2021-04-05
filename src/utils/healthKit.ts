import { Platform } from 'react-native';
import { Medication, DoseLog } from '../types/medication';

// HealthKit integration — iOS only
// Uses @kingstinct/react-native-healthkit

let Healthkit: any = null;

// Lazy-load the HealthKit module only on iOS
async function getHealthkit() {
  if (Platform.OS !== 'ios') return null;
  if (Healthkit) return Healthkit;

  try {
    const module = await import('@kingstinct/react-native-healthkit');
    Healthkit = module.default;
    return Healthkit;
  } catch {
    return null;
  }
}

export async function requestHealthKitPermissions(): Promise<boolean> {
  const HK = await getHealthkit();
  if (!HK) return false;

  try {
    // Request permission to write medication data
    await HK.requestAuthorization(
      [],  // read types
      ['HKCategoryTypeIdentifierMindfulSession']  // write types
    );
    return true;
  } catch {
    return false;
  }
}

export async function logMedicationToHealthKit(
  medication: Medication,
  doseLog: DoseLog
): Promise<boolean> {
  const HK = await getHealthkit();
  if (!HK) return false;
  if (!doseLog.takenAt) return false;

  try {
    // Log as a mindful session for now — HealthKit doesn't have a native
    // medication type. Custom HKObjectType would require entitlements.
    await HK.saveQuantitySample(
      'HKCategoryTypeIdentifierMindfulSession',
      {},
      new Date(doseLog.takenAt),
      new Date(doseLog.takenAt + 60 * 1000),  // 1 minute session
      {
        HKMetadataKeyExternalUUID: doseLog.id,
        MedicationName: medication.name,
        MedicationDosage: `${medication.dosage}${medication.unit}`,
      }
    );
    return true;
  } catch {
    return false;
  }
}

export async function getHealthKitStepCount(date: string): Promise<number | null> {
  const HK = await getHealthkit();
  if (!HK) return null;

  try {
    const startDate = new Date(date + 'T00:00:00');
    const endDate = new Date(date + 'T23:59:59');

    const samples = await HK.queryQuantitySamples(
      'HKQuantityTypeIdentifierStepCount',
      { from: startDate, to: endDate }
    );

    return samples.reduce((sum: number, s: any) => sum + s.quantity, 0);
  } catch {
    return null;
  }
}

export const isHealthKitAvailable = Platform.OS === 'ios';
