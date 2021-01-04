import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import MedicationModel from './models/MedicationModel';
import DoseLogModel from './models/DoseLogModel';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'medtrack',
  migrations: undefined,  // no migrations yet for v1
  jsi: false,  // Hermes JSI — disabled on Expo SDK 40 (enabled later with RN 0.65+)
});

const database = new Database({
  adapter,
  modelClasses: [MedicationModel, DoseLogModel],
});

export default database;
export { MedicationModel, DoseLogModel };
