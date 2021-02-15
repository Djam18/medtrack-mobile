import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { DoseLog, DailyStats, AdherenceStreak } from '../types/medication';

interface StatisticsScreenProps {
  logs: DoseLog[];
}

function computeStats(logs: DoseLog[]): {
  last7Days: DailyStats[];
  last30Days: DailyStats[];
  streak: AdherenceStreak;
  overallRate: number;
} {
  const byDate: Record<string, DoseLog[]> = {};
  for (const log of logs) {
    byDate[log.date] = [...(byDate[log.date] ?? []), log];
  }

  const getDayStats = (date: string): DailyStats => {
    const dayLogs = byDate[date] ?? [];
    const total = dayLogs.length;
    const taken = dayLogs.filter(l => l.takenAt !== null).length;
    const skipped = dayLogs.filter(l => l.skipped).length;
    const missed = total - taken - skipped;
    return {
      date,
      total,
      taken,
      skipped,
      missed: Math.max(0, missed),
      adherenceRate: total > 0 ? Math.round((taken / total) * 100) : 0,
    };
  };

  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return getDayStats(d.toISOString().split('T')[0]);
  });

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    return getDayStats(d.toISOString().split('T')[0]);
  });

  // Calculate streak
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastMissedDate: string | null = null;

  for (let i = last30Days.length - 1; i >= 0; i--) {
    const day = last30Days[i];
    if (day.total === 0) continue;  // No doses scheduled — don't break streak
    if (day.adherenceRate === 100) {
      tempStreak++;
      if (i >= last30Days.length - currentStreak - 1) {
        currentStreak = tempStreak;
      }
    } else {
      if (lastMissedDate === null) lastMissedDate = day.date;
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  const totalLogs = logs.length;
  const totalTaken = logs.filter(l => l.takenAt !== null).length;
  const overallRate = totalLogs > 0 ? Math.round((totalTaken / totalLogs) * 100) : 0;

  return {
    last7Days,
    last30Days,
    streak: { currentStreak, longestStreak, lastMissedDate },
    overallRate,
  };
}

function BarChart({ data }: { data: DailyStats[] }) {
  const max = Math.max(...data.map(d => d.total), 1);
  return (
    <View style={chartStyles.container}>
      {data.map((day, i) => (
        <View key={i} style={chartStyles.barWrapper}>
          <View style={chartStyles.barTrack}>
            <View
              style={[
                chartStyles.bar,
                {
                  height: `${(day.taken / max) * 100}%` as any,
                  backgroundColor: day.adherenceRate >= 80 ? '#22c55e' : '#f59e0b',
                },
              ]}
            />
          </View>
          <Text style={chartStyles.barLabel}>
            {new Date(day.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'narrow' })}
          </Text>
        </View>
      ))}
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 4,
  },
  barWrapper: { flex: 1, alignItems: 'center', gap: 4 },
  barTrack: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: { width: '100%', borderRadius: 4 },
  barLabel: { fontSize: 10, color: '#6b7280' },
});

function StatisticsScreen({ logs }: StatisticsScreenProps) {
  const { last7Days, streak, overallRate } = useMemo(
    () => computeStats(logs),
    [logs]
  );

  const last7Rate = useMemo(() => {
    const valid = last7Days.filter(d => d.total > 0);
    if (valid.length === 0) return 0;
    return Math.round(valid.reduce((sum, d) => sum + d.adherenceRate, 0) / valid.length);
  }, [last7Days]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistics</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* KPI row */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, overallRate >= 80 ? styles.kpiGood : styles.kpiWarn]}>
              {overallRate}%
            </Text>
            <Text style={styles.kpiLabel}>Overall</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, last7Rate >= 80 ? styles.kpiGood : styles.kpiWarn]}>
              {last7Rate}%
            </Text>
            <Text style={styles.kpiLabel}>Last 7 days</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{streak.currentStreak}</Text>
            <Text style={styles.kpiLabel}>Day streak</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{streak.longestStreak}</Text>
            <Text style={styles.kpiLabel}>Best streak</Text>
          </View>
        </View>

        {/* Weekly chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>This Week</Text>
          <BarChart data={last7Days} />
        </View>

        {/* Streak info */}
        {streak.currentStreak > 0 && (
          <View style={[styles.card, styles.streakCard]}>
            <Text style={styles.streakEmoji}></Text>
            <Text style={styles.streakText}>
              {streak.currentStreak} day streak! Keep it up!
            </Text>
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
  content: { padding: 16, gap: 16 },
  kpiRow: { flexDirection: 'row', gap: 12 },
  kpiCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  kpiValue: { fontSize: 22, fontWeight: '800', color: '#111827' },
  kpiGood: { color: '#22c55e' },
  kpiWarn: { color: '#f59e0b' },
  kpiLabel: { fontSize: 11, color: '#6b7280', marginTop: 2, textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 12 },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fef9c3',
  },
  streakEmoji: { fontSize: 28 },
  streakText: { fontSize: 15, fontWeight: '600', color: '#92400e', flex: 1 },
});

export default StatisticsScreen;
