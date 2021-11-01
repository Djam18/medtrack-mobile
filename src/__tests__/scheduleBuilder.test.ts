import { buildDailySchedule, calculateAdherence, getUpcomingDoses } from '../utils/scheduleBuilder';
import { Medication, DoseLog } from '../types/medication';

const baseMed: Medication = {
  id: 'med-1',
  name: 'Metformin',
  dosage: 500,
  unit: 'mg',
  frequency: 'twice-daily',
  times: ['08:00', '20:00'],
  notes: '',
  color: '#3b82f6',
  startDate: '2021-01-01',
  endDate: null,
  isActive: true,
  createdAt: 0,
  updatedAt: 0,
};

describe('buildDailySchedule', () => {
  it('generates two doses for twice-daily medication', () => {
    const doses = buildDailySchedule([baseMed], '2021-06-15');
    expect(doses).toHaveLength(2);
    expect(doses[0].scheduledTime).toBe('2021-06-15T08:00:00');
    expect(doses[1].scheduledTime).toBe('2021-06-15T20:00:00');
  });

  it('skips inactive medications', () => {
    const inactiveMed = { ...baseMed, isActive: false };
    const doses = buildDailySchedule([inactiveMed], '2021-06-15');
    expect(doses).toHaveLength(0);
  });

  it('skips medications that ended before the date', () => {
    const expiredMed = { ...baseMed, endDate: '2021-05-01' };
    const doses = buildDailySchedule([expiredMed], '2021-06-15');
    expect(doses).toHaveLength(0);
  });

  it('skips medications that start after the date', () => {
    const futureMed = { ...baseMed, startDate: '2021-12-01' };
    const doses = buildDailySchedule([futureMed], '2021-06-15');
    expect(doses).toHaveLength(0);
  });

  it('returns empty array for no medications', () => {
    expect(buildDailySchedule([], '2021-06-15')).toHaveLength(0);
  });

  it('sets correct medication name on dose', () => {
    const doses = buildDailySchedule([baseMed], '2021-06-15');
    expect(doses[0].medicationName).toBe('Metformin');
  });

  it('sorts doses by scheduled time', () => {
    const doses = buildDailySchedule([baseMed], '2021-06-15');
    expect(doses[0].scheduledTime < doses[1].scheduledTime).toBe(true);
  });
});

describe('calculateAdherence', () => {
  const logs: DoseLog[] = [
    { id: '1', medicationId: 'med-1', medicationName: 'Metformin', scheduledTime: '2021-06-01T08:00:00', takenAt: 1000, skipped: false, notes: '', date: '2021-06-01' },
    { id: '2', medicationId: 'med-1', medicationName: 'Metformin', scheduledTime: '2021-06-01T20:00:00', takenAt: null, skipped: true, notes: '', date: '2021-06-01' },
    { id: '3', medicationId: 'med-1', medicationName: 'Metformin', scheduledTime: '2021-06-02T08:00:00', takenAt: 2000, skipped: false, notes: '', date: '2021-06-02' },
    { id: '4', medicationId: 'med-1', medicationName: 'Metformin', scheduledTime: '2021-06-02T20:00:00', takenAt: 3000, skipped: false, notes: '', date: '2021-06-02' },
  ];

  it('calculates 75% adherence when 3 of 4 are taken', () => {
    expect(calculateAdherence(logs, '2021-06-01', '2021-06-02')).toBe(75);
  });

  it('returns 0 for empty log range', () => {
    expect(calculateAdherence([], '2021-06-01', '2021-06-02')).toBe(0);
  });

  it('returns 100 when all doses taken', () => {
    const allTaken = logs.map(l => ({ ...l, takenAt: 1000, skipped: false }));
    expect(calculateAdherence(allTaken, '2021-06-01', '2021-06-02')).toBe(100);
  });
});
