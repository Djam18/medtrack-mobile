import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Medication } from '../types/medication';

interface MedicationListScreenProps {
  medications: Medication[];
  onAddMedication: () => void;
  onSelectMedication: (med: Medication) => void;
}

const FREQUENCY_LABELS: Record<string, string> = {
  daily: 'Once daily',
  'twice-daily': 'Twice daily',
  'three-times-daily': '3x daily',
  weekly: 'Weekly',
  'as-needed': 'As needed',
};

function MedicationCard({
  medication,
  onPress,
}: {
  medication: Medication;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.colorDot, { backgroundColor: medication.color }]} />
      <View style={styles.cardContent}>
        <Text style={styles.medName}>{medication.name}</Text>
        <Text style={styles.medDosage}>
          {medication.dosage} {medication.unit} — {FREQUENCY_LABELS[medication.frequency]}
        </Text>
        {medication.notes.length > 0 && (
          <Text style={styles.medNotes} numberOfLines={1}>
            {medication.notes}
          </Text>
        )}
      </View>
      <View style={[styles.statusBadge, medication.isActive ? styles.active : styles.inactive]}>
        <Text style={styles.statusText}>{medication.isActive ? 'Active' : 'Inactive'}</Text>
      </View>
    </TouchableOpacity>
  );
}

function MedicationListScreen({
  medications,
  onAddMedication,
  onSelectMedication,
}: MedicationListScreenProps) {
  const activeMeds = medications.filter(m => m.isActive);
  const inactiveMeds = medications.filter(m => !m.isActive);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medications</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddMedication}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {medications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No medications yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap + Add to track your first medication
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={onAddMedication}>
            <Text style={styles.emptyButtonText}>Add Medication</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={[...activeMeds, ...inactiveMeds]}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MedicationCard
              medication={item}
              onPress={() => onSelectMedication(item)}
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
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  medName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  medDosage: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  medNotes: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  active: {
    backgroundColor: '#dcfce7',
  },
  inactive: {
    backgroundColor: '#f3f4f6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default MedicationListScreen;
