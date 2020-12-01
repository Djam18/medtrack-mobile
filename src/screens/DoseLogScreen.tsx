import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { DoseLog, DoseStatus } from '../types/medication';

interface DoseLogScreenProps {
  date: string;  // YYYY-MM-DD
  doses: DoseLog[];
  onMarkTaken: (doseId: string) => void;
  onMarkSkipped: (doseId: string) => void;
  onDateChange: (date: string) => void;
}

function getDoseStatus(dose: DoseLog): DoseStatus {
  if (dose.takenAt !== null) return 'taken';
  if (dose.skipped) return 'skipped';
  const scheduled = new Date(dose.scheduledTime);
  if (scheduled < new Date()) return 'missed';
  return 'pending';
}

const STATUS_COLORS: Record<DoseStatus, string> = {
  taken: '#22c55e',
  skipped: '#f59e0b',
  missed: '#ef4444',
  pending: '#e5e7eb',
};

const STATUS_LABELS: Record<DoseStatus, string> = {
  taken: 'Taken',
  skipped: 'Skipped',
  missed: 'Missed',
  pending: 'Pending',
};

function DoseItem({
  dose,
  onMarkTaken,
  onMarkSkipped,
}: {
  dose: DoseLog;
  onMarkTaken: () => void;
  onMarkSkipped: () => void;
}) {
  const status = getDoseStatus(dose);

  return (
    <View style={styles.doseCard}>
      <View style={[styles.statusBar, { backgroundColor: STATUS_COLORS[status] }]} />
      <View style={styles.doseInfo}>
        <Text style={styles.medName}>{dose.medicationName}</Text>
        <Text style={styles.scheduleTime}>{dose.scheduledTime.split('T')[1]?.slice(0, 5) ?? dose.scheduledTime}</Text>
        {dose.notes.length > 0 && <Text style={styles.doseNotes}>{dose.notes}</Text>}
      </View>
      <View style={styles.doseActions}>
        <Text style={[styles.statusLabel, { color: STATUS_COLORS[status] }]}>
          {STATUS_LABELS[status]}
        </Text>
        {status === 'pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.btnTaken} onPress={onMarkTaken}>
              <Text style={styles.btnTakenText}>Taken</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSkip} onPress={onMarkSkipped}>
              <Text style={styles.btnSkipText}>Skip</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split('T')[0]) return 'Today';
  if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';

  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function DoseLogScreen({
  date,
  doses,
  onMarkTaken,
  onMarkSkipped,
  onDateChange,
}: DoseLogScreenProps) {
  const taken = doses.filter(d => getDoseStatus(d) === 'taken').length;
  const total = doses.length;
  const adherence = total > 0 ? Math.round((taken / total) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Date navigation */}
      <View style={styles.dateNav}>
        <TouchableOpacity onPress={() => onDateChange(addDays(date, -1))}>
          <Text style={styles.navArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.dateLabel}>{formatDisplayDate(date)}</Text>
        <TouchableOpacity onPress={() => onDateChange(addDays(date, 1))}>
          <Text style={styles.navArrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{taken}/{total}</Text>
          <Text style={styles.summaryLabel}>Doses taken</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, adherence >= 80 ? styles.good : styles.warn]}>
            {adherence}%
          </Text>
          <Text style={styles.summaryLabel}>Adherence</Text>
        </View>
      </View>

      {doses.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No doses scheduled for this day</Text>
        </View>
      ) : (
        <FlatList
          data={doses}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <DoseItem
              dose={item}
              onMarkTaken={() => onMarkTaken(item.id)}
              onMarkSkipped={() => onMarkSkipped(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  navArrow: { fontSize: 20, color: '#2563eb', paddingHorizontal: 12 },
  dateLabel: { fontSize: 17, fontWeight: '600', color: '#111827' },
  summary: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNumber: { fontSize: 28, fontWeight: '800', color: '#111827' },
  summaryLabel: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: '#e5e7eb', marginVertical: 4 },
  good: { color: '#22c55e' },
  warn: { color: '#f59e0b' },
  list: { padding: 16 },
  doseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBar: { width: 4 },
  doseInfo: { flex: 1, padding: 14 },
  medName: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 },
  scheduleTime: { fontSize: 13, color: '#6b7280' },
  doseNotes: { fontSize: 12, color: '#9ca3af', marginTop: 4, fontStyle: 'italic' },
  doseActions: { padding: 14, alignItems: 'flex-end', justifyContent: 'center' },
  statusLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  actionButtons: { gap: 6 },
  btnTaken: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  btnTakenText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  btnSkip: {
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  btnSkipText: { color: '#f59e0b', fontWeight: '600', fontSize: 13 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 15, color: '#6b7280' },
});

export default DoseLogScreen;
