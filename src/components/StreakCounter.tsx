import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AdherenceStreak } from '../types/medication';

interface StreakCounterProps {
  streak: AdherenceStreak;
}

function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={`Current streak: ${streak.currentStreak} days. Longest streak: ${streak.longestStreak} days`}
    >
      <View style={styles.streakBlock}>
        <Text style={styles.streakValue}>{streak.currentStreak}</Text>
        <Text style={styles.streakLabel}>day streak</Text>
        <Text style={styles.fireEmoji}>{streak.currentStreak >= 7 ? '' : ''}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.streakBlock}>
        <Text style={styles.streakValue}>{streak.longestStreak}</Text>
        <Text style={styles.streakLabel}>best streak</Text>
        <Text style={styles.fireEmoji}></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  streakBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  streakValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
  },
  streakLabel: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fireEmoji: {
    fontSize: 20,
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
});

export default StreakCounter;
