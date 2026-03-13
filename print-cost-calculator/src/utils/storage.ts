import { CalculationResult, CalculationInput, FilamentProfile, PrinterProfile } from '../types/calculation';

const STORAGE_KEY = 'print_cost_history';
const DRAFT_KEY = 'print_cost_draft';

function safeWrite(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`localStorage write failed for "${key}":`, e);
  }
}

export function saveCalculation(result: CalculationResult): void {
  const history = loadHistory();
  history.unshift(result);
  safeWrite(STORAGE_KEY, history.slice(0, 100));
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
  safeWrite(STORAGE_KEY, loadHistory().filter(r => r.id !== id));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function saveDraft(input: CalculationInput): void {
  safeWrite(DRAFT_KEY, input);
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
  safeWrite(FILAMENTS_KEY, list);
}

export function deleteFilamentProfile(id: string): void {
  safeWrite(FILAMENTS_KEY, loadFilamentProfiles().filter(p => p.id !== id));
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
  safeWrite(PRINTERS_KEY, list);
}

export function deletePrinterProfile(id: string): void {
  safeWrite(PRINTERS_KEY, loadPrinterProfiles().filter(p => p.id !== id));
}
