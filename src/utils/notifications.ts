import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';
import { Medication } from '../types/medication';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('medication-reminders', {
      name: 'Medication Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2563eb',
    });
  }

  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function scheduleMedicationReminder(
  medication: Medication,
  time: string  // 'HH:MM'
): Promise<string> {
  const [hours, minutes] = time.split(':').map(Number);

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Medication Reminder',
      body: `Time to take ${medication.name} — ${medication.dosage}${medication.unit}`,
      data: { medicationId: medication.id },
      sound: true,
    },
    trigger: {
      hour: hours,
      minute: minutes,
      repeats: true,
    },
  });

  return notificationId;
}

export async function cancelMedicationReminder(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getScheduledNotifications() {
  return Notifications.getAllScheduledNotificationsAsync();
}
