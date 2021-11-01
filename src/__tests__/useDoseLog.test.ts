import { renderHook, act } from '@testing-library/react-hooks';
import { useDoseLog } from '../hooks/useDoseLog';
import { DoseLog } from '../types/medication';

const makeLog = (overrides: Partial<DoseLog> = {}): DoseLog => ({
  id: 'dose-1',
  medicationId: 'med-1',
  medicationName: 'Metformin',
  scheduledTime: '2021-06-15T08:00:00',
  takenAt: null,
  skipped: false,
  notes: '',
  date: '2021-06-15',
  ...overrides,
});

describe('useDoseLog', () => {
  it('returns empty array for unknown date', () => {
    const { result } = renderHook(() => useDoseLog());
    expect(result.current.getDosesForDate('2021-01-01')).toEqual([]);
  });

  it('adds a dose entry', () => {
    const { result } = renderHook(() => useDoseLog());
    const log = makeLog();

    act(() => {
      result.current.addDoseEntry(log);
    });

    expect(result.current.getDosesForDate('2021-06-15')).toHaveLength(1);
  });

  it('marks dose as taken', () => {
    const { result } = renderHook(() => useDoseLog());
    const log = makeLog();

    act(() => {
      result.current.addDoseEntry(log);
    });

    act(() => {
      result.current.markTaken('dose-1', '2021-06-15');
    });

    const doses = result.current.getDosesForDate('2021-06-15');
    expect(doses[0].takenAt).not.toBeNull();
    expect(doses[0].skipped).toBe(false);
  });

  it('marks dose as skipped', () => {
    const { result } = renderHook(() => useDoseLog());
    const log = makeLog();

    act(() => {
      result.current.addDoseEntry(log);
    });

    act(() => {
      result.current.markSkipped('dose-1', '2021-06-15');
    });

    const doses = result.current.getDosesForDate('2021-06-15');
    expect(doses[0].skipped).toBe(true);
    expect(doses[0].takenAt).toBeNull();
  });

  it('does not affect other doses when marking one', () => {
    const { result } = renderHook(() => useDoseLog());
    const log1 = makeLog({ id: 'dose-1' });
    const log2 = makeLog({ id: 'dose-2' });

    act(() => {
      result.current.addDoseEntry(log1);
      result.current.addDoseEntry(log2);
    });

    act(() => {
      result.current.markTaken('dose-1', '2021-06-15');
    });

    const doses = result.current.getDosesForDate('2021-06-15');
    expect(doses.find(d => d.id === 'dose-2')?.takenAt).toBeNull();
  });
});
