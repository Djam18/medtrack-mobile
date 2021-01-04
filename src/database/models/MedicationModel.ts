import { Model } from '@nozbe/watermelondb';
import { field, readonly, date, children } from '@nozbe/watermelondb/decorators';

export default class MedicationModel extends Model {
  static table = 'medications';
  static associations = {
    dose_logs: { type: 'has_many' as const, foreignKey: 'medication_id' },
  };

  @field('name') name!: string;
  @field('dosage') dosage!: number;
  @field('unit') unit!: string;
  @field('frequency') frequency!: string;
  @field('times') timesJson!: string;  // stored as JSON string
  @field('notes') notes!: string;
  @field('color') color!: string;
  @field('start_date') startDate!: string;
  @field('end_date') endDate!: string | null;
  @field('is_active') isActive!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('dose_logs') doseLogs!: any;

  get times(): string[] {
    try {
      return JSON.parse(this.timesJson);
    } catch {
      return [];
    }
  }
}
