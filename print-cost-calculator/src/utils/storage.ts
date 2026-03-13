import { CalculationResult, CalculationInput } from '../types/calculation';

const STORAGE_KEY = 'print_cost_history';
const DRAFT_KEY = 'print_cost_draft';

export function saveCalculation(result: CalculationResult): void {
  const history = loadHistory();
  history.unshift(result);
  // Храним не более 100 записей
  const trimmed = history.slice(0, 100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function loadHistory(): CalculationResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteCalculation(id: string): void {
  const history = loadHistory().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function saveDraft(input: CalculationInput): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(input));
}

export function loadDraft(): CalculationInput | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
