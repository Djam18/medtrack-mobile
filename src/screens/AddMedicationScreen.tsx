import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Medication, Frequency, DoseUnit } from '../types/medication';

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'daily', label: 'Once daily' },
  { value: 'twice-daily', label: 'Twice daily' },
  { value: 'three-times-daily', label: '3x daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'as-needed', label: 'As needed' },
];

const UNITS: DoseUnit[] = ['mg', 'ml', 'tablet', 'capsule', 'drop', 'unit'];

const MED_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];

interface AddMedicationScreenProps {
  onSave: (medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

function AddMedicationScreen({ onSave, onCancel }: AddMedicationScreenProps) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [unit, setUnit] = useState<DoseUnit>('mg');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState(MED_COLORS[5]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a medication name.');
      return;
    }
    if (!dosage || isNaN(Number(dosage)) || Number(dosage) <= 0) {
      Alert.alert('Required', 'Please enter a valid dosage.');
      return;
    }

    onSave({
      name: name.trim(),
      dosage: Number(dosage),
      unit,
      frequency,
      times: ['08:00'],
      notes: notes.trim(),
      color,
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      isActive: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Medication</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Medication Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Metformin, Lisinopril"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
          />
        </View>

        {/* Dosage + unit */}
        <View style={styles.row}>
          <View style={[styles.field, { flex: 1, marginRight: 12 }]}>
            <Text style={styles.label}>Dosage</Text>
            <TextInput
              style={styles.input}
              value={dosage}
              onChangeText={setDosage}
              placeholder="500"
              placeholderTextColor="#9ca3af"
              keyboardType="decimal-pad"
            />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Unit</Text>
            <View style={styles.unitRow}>
              {UNITS.map(u => (
                <TouchableOpacity
                  key={u}
                  style={[styles.chip, unit === u && styles.chipActive]}
                  onPress={() => setUnit(u)}
                >
                  <Text style={[styles.chipText, unit === u && styles.chipTextActive]}>
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Frequency */}
        <View style={styles.field}>
          <Text style={styles.label}>Frequency</Text>
          {FREQUENCIES.map(f => (
            <TouchableOpacity
              key={f.value}
              style={[styles.radioRow, frequency === f.value && styles.radioRowActive]}
              onPress={() => setFrequency(f.value)}
            >
              <View style={[styles.radio, frequency === f.value && styles.radioFilled]} />
              <Text style={styles.radioLabel}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Color */}
        <View style={styles.field}>
          <Text style={styles.label}>Color</Text>
          <View style={styles.colorRow}>
            {MED_COLORS.map(c => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: c },
                  color === c && styles.colorSwatchSelected,
                ]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.field}>
          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Take with food, avoid alcohol..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
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
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#111827' },
  cancelText: { fontSize: 16, color: '#6b7280' },
  saveText: { fontSize: 16, color: '#2563eb', fontWeight: '600' },
  form: { padding: 20, gap: 20 },
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  unitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  chipActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  chipText: { fontSize: 13, color: '#6b7280' },
  chipTextActive: { color: '#2563eb', fontWeight: '600' },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  radioRowActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  radioFilled: { borderColor: '#2563eb', backgroundColor: '#2563eb' },
  radioLabel: { fontSize: 15, color: '#374151' },
  colorRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: '#111827',
  },
});

export default AddMedicationScreen;
