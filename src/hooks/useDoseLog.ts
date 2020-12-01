import { useState, useCallback } from 'react';
import { DoseLog } from '../types/medication';

type DoseLogState = Record<string, DoseLog[]>;  // keyed by YYYY-MM-DD

export function useDoseLog() {
  const [logs, setLogs] = useState<DoseLogState>({});

  const getDosesForDate = useCallback(
    (date: string): DoseLog[] => logs[date] ?? [],
    [logs]
  );

  const markTaken = useCallback((doseId: string, date: string) => {
    setLogs(prev => ({
      ...prev,
      [date]: (prev[date] ?? []).map(dose =>
        dose.id === doseId
          ? { ...dose, takenAt: Date.now(), skipped: false }
          : dose
      ),
    }));
  }, []);

  const markSkipped = useCallback((doseId: string, date: string) => {
    setLogs(prev => ({
      ...prev,
      [date]: (prev[date] ?? []).map(dose =>
        dose.id === doseId
          ? { ...dose, skipped: true, takenAt: null }
          : dose
      ),
    }));
  }, []);

  const addDoseEntry = useCallback((dose: DoseLog) => {
    setLogs(prev => ({
      ...prev,
      [dose.date]: [...(prev[dose.date] ?? []), dose],
    }));
  }, []);

  return { getDosesForDate, markTaken, markSkipped, addDoseEntry, logs };
}
