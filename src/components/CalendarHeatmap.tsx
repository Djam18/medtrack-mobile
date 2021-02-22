import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DailyStats } from '../types/medication';

interface CalendarHeatmapProps {
  stats: DailyStats[];  // last 84 days (12 weeks)
  onDayPress?: (date: string) => void;
}

function getHeatColor(rate: number, hasData: boolean): string {
  if (!hasData) return '#f3f4f6';
  if (rate === 0) return '#fecaca';  // red — missed all
  if (rate < 50) return '#fca5a5';
  if (rate < 80) return '#fde68a';  // yellow — partial
  if (rate < 100) return '#86efac';
  return '#22c55e';                  // green — perfect
}

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function CalendarHeatmap({ stats, onDayPress }: CalendarHeatmapProps) {
  const weeks = useMemo(() => {
    // Group stats into weeks of 7
    const result: (DailyStats | null)[][] = [];
    let currentWeek: (DailyStats | null)[] = [];

    // Pad the start so the first day lands on the correct weekday
    if (stats.length > 0) {
      const firstDate = new Date(stats[0].date + 'T12:00:00');
      const dayOfWeek = firstDate.getDay();
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push(null);
      }
    }

    for (const stat of stats) {
      currentWeek.push(stat);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill last week if incomplete
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push(null);
    }
    if (currentWeek.length === 7) {
      result.push(currentWeek);
    }

    return result;
  }, [stats]);

  const monthLabel = useMemo(() => {
    if (stats.length === 0) return '';
    const first = new Date(stats[0].date + 'T12:00:00');
    const last = new Date(stats[stats.length - 1].date + 'T12:00:00');
    const fmt = (d: Date) => d.toLocaleDateString('en', { month: 'short' });
    return fmt(first) === fmt(last) ? fmt(first) : `${fmt(first)} – ${fmt(last)}`;
  }, [stats]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <View style={styles.legend}>
          {[0, 50, 80, 100].map(rate => (
            <View key={rate} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: getHeatColor(rate, true) }]} />
              <Text style={styles.legendText}>{rate}%</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Weekday labels */}
      <View style={styles.weekdays}>
        {WEEK_DAYS.map((day, i) => (
          <Text key={i} style={styles.weekdayLabel}>{day}</Text>
        ))}
      </View>

      {/* Heatmap grid */}
      <View style={styles.grid}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.week}>
            {week.map((day, di) => {
              if (!day) {
                return <View key={di} style={styles.cell} />;
              }
              const color = getHeatColor(day.adherenceRate, day.total > 0);
              return (
                <TouchableOpacity
                  key={di}
                  style={[styles.cell, { backgroundColor: color }]}
                  onPress={() => onDayPress?.(day.date)}
                  accessibilityLabel={`${day.date}: ${day.adherenceRate}% adherence, ${day.taken} of ${day.total} doses taken`}
                  accessibilityRole="button"
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const CELL_SIZE = 32;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  legend: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 9,
    color: '#6b7280',
  },
  weekdays: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekdayLabel: {
    width: CELL_SIZE,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  week: {
    flexDirection: 'column',
  },
  cell: {
    width: CELL_SIZE - 2,
    height: CELL_SIZE - 2,
    margin: 1,
    borderRadius: 4,
    backgroundColor: '#f3f4f6',
  },
});

export default CalendarHeatmap;
