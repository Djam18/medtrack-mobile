import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  AccessibilityInfo,
} from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  accessibilityLabel: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Track Your Medications',
    subtitle: 'Keep all your medications organized in one place. Never miss a dose again.',
    emoji: '',
    accessibilityLabel: 'Pill illustration',
  },
  {
    id: '2',
    title: 'Smart Reminders',
    subtitle: 'Get notified at the right time. Customize schedules for every medication.',
    emoji: '',
    accessibilityLabel: 'Bell notification illustration',
  },
  {
    id: '3',
    title: 'Monitor Your Progress',
    subtitle: 'View adherence statistics, streaks, and trends to stay on track with your health.',
    emoji: '',
    accessibilityLabel: 'Chart illustration',
  },
  {
    id: '4',
    title: 'Share With Your Doctor',
    subtitle: 'Export your medication history as a PDF for your next appointment.',
    emoji: '',
    accessibilityLabel: 'Doctor illustration',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const goNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      const next = activeIndex + 1;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
      AccessibilityInfo.announceForAccessibility(SLIDES[next].title);
    } else {
      onComplete();
    }
  };

  const goToSlide = (index: number) => {
    listRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View
            style={styles.slide}
            accessible
            accessibilityLabel={`Slide ${item.id} of ${SLIDES.length}: ${item.title}`}
          >
            <View
              style={styles.illustration}
              accessibilityLabel={item.accessibilityLabel}
              accessibilityRole="image"
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.title} accessibilityRole="header">
              {item.title}
            </Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Pagination dots */}
      <View
        style={styles.pagination}
        accessible
        accessibilityLabel={`Step ${activeIndex + 1} of ${SLIDES.length}`}
      >
        {SLIDES.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
            onPress={() => goToSlide(index)}
            accessibilityLabel={`Go to slide ${index + 1}`}
          />
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btnNext}
          onPress={goNext}
          accessibilityLabel={activeIndex === SLIDES.length - 1 ? 'Get started' : 'Next slide'}
          accessibilityRole="button"
        >
          <Text style={styles.btnNextText}>
            {activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
        {activeIndex < SLIDES.length - 1 && (
          <TouchableOpacity
            onPress={onComplete}
            accessibilityLabel="Skip onboarding"
            accessibilityRole="button"
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  illustration: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  dotActive: {
    backgroundColor: '#2563eb',
    width: 24,
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 16,
  },
  btnNext: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnNextText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  skipText: {
    color: '#6b7280',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default OnboardingScreen;
