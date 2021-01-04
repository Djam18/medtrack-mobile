import { appSchema, tableSchema } from '@nozbe/watermelondb';

// WatermelonDB schema — SQLite under the hood
export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'medications',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'dosage', type: 'number' },
        { name: 'unit', type: 'string' },
        { name: 'frequency', type: 'string' },
        { name: 'times', type: 'string' },  // JSON array stored as string
        { name: 'notes', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'start_date', type: 'string' },
        { name: 'end_date', type: 'string', isOptional: true },
        { name: 'is_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'dose_logs',
      columns: [
        { name: 'medication_id', type: 'string', isIndexed: true },
        { name: 'medication_name', type: 'string' },
        { name: 'scheduled_time', type: 'string' },
        { name: 'taken_at', type: 'number', isOptional: true },
        { name: 'skipped', type: 'boolean' },
        { name: 'notes', type: 'string' },
        { name: 'date', type: 'string', isIndexed: true },
      ],
    }),
  ],
});
