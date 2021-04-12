import { Platform } from 'react-native';
import { isHealthKitAvailable, getHealthKitStepCount } from './healthKit';
import { isGoogleFitAvailable, getGoogleFitStepCount } from './googleFit';

// Platform-agnostic health data API
// Routes to HealthKit on iOS, Google Fit on Android

export async function getStepsForDate(date: string): Promise<number | null> {
  if (isHealthKitAvailable) {
    return getHealthKitStepCount(date);
  }
  if (isGoogleFitAvailable) {
    return getGoogleFitStepCount(date);
  }
  return null;
}

export function getHealthPlatformName(): string | null {
  if (Platform.OS === 'ios') return 'Apple Health';
  if (Platform.OS === 'android') return 'Google Fit';
  return null;
}

export function isHealthIntegrationAvailable(): boolean {
  return isHealthKitAvailable || isGoogleFitAvailable;
}
