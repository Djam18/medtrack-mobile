import { Q } from '@nozbe/watermelondb';
import database, { MedicationModel, DoseLogModel } from './database';
import { Medication, DoseLog } from '../types/medication';

export async function getAllMedications(): Promise<Medication[]> {
  const meds = await database.get<MedicationModel>('medications').query().fetch();
  return meds.map(toMedication);
}

export async function getActiveMedications(): Promise<Medication[]> {
  const meds = await database
    .get<MedicationModel>('medications')
    .query(Q.where('is_active', true))
    .fetch();
  return meds.map(toMedication);
}

export async function saveMedication(
  data: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  let id = '';
  await database.write(async () => {
    const record = await database.get<MedicationModel>('medications').create(med => {
      med.name = data.name;
      med.dosage = data.dosage;
      med.unit = data.unit;
      med.frequency = data.frequency;
      med.timesJson = JSON.stringify(data.times);
      med.notes = data.notes;
      med.color = data.color;
      med.startDate = data.startDate;
      med.endDate = data.endDate;
      med.isActive = data.isActive;
    });
    id = record.id;
  });
  return id;
}

export async function updateMedication(
  id: string,
  updates: Partial<Medication>
): Promise<void> {
  const med = await database.get<MedicationModel>('medications').find(id);
  await database.write(async () => {
    await med.update(record => {
      if (updates.name !== undefined) record.name = updates.name;
      if (updates.dosage !== undefined) record.dosage = updates.dosage;
      if (updates.isActive !== undefined) record.isActive = updates.isActive;
      if (updates.notes !== undefined) record.notes = updates.notes;
      if (updates.times !== undefined) record.timesJson = JSON.stringify(updates.times);
    });
  });
}

export async function getDoseLogsForDate(date: string): Promise<DoseLog[]> {
  const logs = await database
    .get<DoseLogModel>('dose_logs')
    .query(Q.where('date', date))
    .fetch();
  return logs.map(toDoseLog);
}

export async function saveDoseLog(data: DoseLog): Promise<void> {
  await database.write(async () => {
    await database.get<DoseLogModel>('dose_logs').create(log => {
      log.medicationId = data.medicationId;
      log.medicationName = data.medicationName;
      log.scheduledTime = data.scheduledTime;
      log.takenAt = data.takenAt;
      log.skipped = data.skipped;
      log.notes = data.notes;
      log.date = data.date;
    });
  });
}

export async function updateDoseLog(
  id: string,
  updates: Pick<DoseLog, 'takenAt' | 'skipped'>
): Promise<void> {
  const log = await database.get<DoseLogModel>('dose_logs').find(id);
  await database.write(async () => {
    await log.update(record => {
      record.takenAt = updates.takenAt;
      record.skipped = updates.skipped;
    });
  });
}

function toMedication(model: MedicationModel): Medication {
  return {
    id: model.id,
    name: model.name,
    dosage: model.dosage,
    unit: model.unit as Medication['unit'],
    frequency: model.frequency as Medication['frequency'],
    times: model.times,
    notes: model.notes,
    color: model.color,
    startDate: model.startDate,
    endDate: model.endDate,
    isActive: model.isActive,
    createdAt: model.createdAt.getTime(),
    updatedAt: model.updatedAt.getTime(),
  };
}

function toDoseLog(model: DoseLogModel): DoseLog {
  return {
    id: model.id,
    medicationId: model.medicationId,
    medicationName: model.medicationName,
    scheduledTime: model.scheduledTime,
    takenAt: model.takenAt,
    skipped: model.skipped,
    notes: model.notes,
    date: model.date,
  };
}
