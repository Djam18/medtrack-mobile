import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import MedicationModel from './MedicationModel';

export default class DoseLogModel extends Model {
  static table = 'dose_logs';
  static associations = {
    medications: { type: 'belongs_to' as const, key: 'medication_id' },
  };

  @field('medication_id') medicationId!: string;
  @field('medication_name') medicationName!: string;
  @field('scheduled_time') scheduledTime!: string;
  @field('taken_at') takenAt!: number | null;
  @field('skipped') skipped!: boolean;
  @field('notes') notes!: string;
  @field('date') date!: string;

  @relation('medications', 'medication_id') medication!: MedicationModel;
}
