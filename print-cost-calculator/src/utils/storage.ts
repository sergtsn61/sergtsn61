import { CalculationResult, CalculationInput, FilamentProfile, PrinterProfile } from '../types/calculation';

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

// ── Профили филаментов ───────────────────────────────────────────

const FILAMENTS_KEY = 'print_cost_filaments';

export function loadFilamentProfiles(): FilamentProfile[] {
  try {
    const raw = localStorage.getItem(FILAMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveFilamentProfile(profile: FilamentProfile): void {
  const list = loadFilamentProfiles().filter(p => p.id !== profile.id);
  list.unshift(profile);
  localStorage.setItem(FILAMENTS_KEY, JSON.stringify(list));
}

export function deleteFilamentProfile(id: string): void {
  const list = loadFilamentProfiles().filter(p => p.id !== id);
  localStorage.setItem(FILAMENTS_KEY, JSON.stringify(list));
}

// ── Профили принтеров ────────────────────────────────────────────

const PRINTERS_KEY = 'print_cost_printers';

export function loadPrinterProfiles(): PrinterProfile[] {
  try {
    const raw = localStorage.getItem(PRINTERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function savePrinterProfile(profile: PrinterProfile): void {
  const list = loadPrinterProfiles().filter(p => p.id !== profile.id);
  list.unshift(profile);
  localStorage.setItem(PRINTERS_KEY, JSON.stringify(list));
}

export function deletePrinterProfile(id: string): void {
  const list = loadPrinterProfiles().filter(p => p.id !== id);
  localStorage.setItem(PRINTERS_KEY, JSON.stringify(list));
}
