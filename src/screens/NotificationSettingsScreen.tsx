import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import {
  requestNotificationPermissions,
  scheduleMedicationReminder,
  cancelAllReminders,
} from '../utils/notifications';
import { Medication } from '../types/medication';

interface NotificationSettingsScreenProps {
  medications: Medication[];
}

function NotificationSettingsScreen({ medications }: NotificationSettingsScreenProps) {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [advanceMinutes, setAdvanceMinutes] = useState(10);

  useEffect(() => {
    requestNotificationPermissions().then(setPermissionsGranted);
  }, []);

  const handleToggleReminders = async (enabled: boolean) => {
    if (enabled && !permissionsGranted) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          'Permission required',
          'Please enable notifications in your device settings to receive medication reminders.'
        );
        return;
      }
      setPermissionsGranted(true);
    }

    setReminderEnabled(enabled);

    if (!enabled) {
      await cancelAllReminders();
    } else {
      // Re-schedule all active medications
      for (const med of medications.filter(m => m.isActive)) {
        for (const time of med.times) {
          await scheduleMedicationReminder(med, time);
        }
      }
    }
  };

  const ADVANCE_OPTIONS = [0, 5, 10, 15, 30];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification Settings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Permission status */}
        {!permissionsGranted && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>
              Notifications are disabled. Enable them in device settings.
            </Text>
          </View>
        )}

        {/* Main toggle */}
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Medication Reminders</Text>
              <Text style={styles.settingSubtitle}>
                Get notified when it's time to take your medication
              </Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={handleToggleReminders}
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={reminderEnabled ? '#2563eb' : '#9ca3af'}
            />
          </View>
        </View>

        {/* Advance notice */}
        {reminderEnabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Remind me</Text>
            {ADVANCE_OPTIONS.map(mins => (
              <TouchableOpacity
                key={mins}
                style={[
                  styles.optionRow,
                  advanceMinutes === mins && styles.optionRowActive,
                ]}
                onPress={() => setAdvanceMinutes(mins)}
              >
                <View style={[styles.radio, advanceMinutes === mins && styles.radioFilled]} />
                <Text style={styles.optionLabel}>
                  {mins === 0 ? 'At the scheduled time' : `${mins} minutes before`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Active medications */}
        {reminderEnabled && medications.filter(m => m.isActive).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scheduled Reminders</Text>
            {medications
              .filter(m => m.isActive)
              .map(med => (
                <View key={med.id} style={styles.medReminder}>
                  <View style={[styles.colorDot, { backgroundColor: med.color }]} />
                  <View style={styles.medReminderInfo}>
                    <Text style={styles.medReminderName}>{med.name}</Text>
                    <Text style={styles.medReminderTimes}>
                      {med.times.length > 0 ? med.times.join(', ') : 'As needed'}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#111827' },
  content: { padding: 20, gap: 20 },
  warningBanner: {
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    padding: 14,
  },
  warningText: { fontSize: 14, color: '#92400e' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    padding: 16,
    paddingBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingInfo: { flex: 1, marginRight: 16 },
  settingTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 },
  settingSubtitle: { fontSize: 13, color: '#6b7280' },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  optionRowActive: { backgroundColor: '#eff6ff' },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  radioFilled: { borderColor: '#2563eb', backgroundColor: '#2563eb' },
  optionLabel: { fontSize: 15, color: '#374151' },
  medReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  medReminderInfo: { flex: 1 },
  medReminderName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  medReminderTimes: { fontSize: 13, color: '#6b7280' },
});

export default NotificationSettingsScreen;
