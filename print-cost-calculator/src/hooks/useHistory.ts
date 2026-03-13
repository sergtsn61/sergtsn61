import { useState, useCallback } from 'react';
import { CalculationResult } from '../types/calculation';
import { loadHistory, deleteCalculation, clearHistory } from '../utils/storage';

export function useHistory() {
  const [history, setHistory] = useState<CalculationResult[]>(() => loadHistory());

  const refresh = useCallback(() => {
    setHistory(loadHistory());
  }, []);

  const remove = useCallback((id: string) => {
    deleteCalculation(id);
    setHistory(prev => prev.filter(r => r.id !== id));
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  return { history, refresh, remove, clear };
}
