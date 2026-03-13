export interface FilamentParams {
  spoolWeight: number;      // граммы в катушке
  spoolPrice: number;       // цена катушки (₽)
  usedWeight: number;       // использовано граммов
  wasteFactor: number;      // % брака/поддержек
}

export interface PrinterParams {
  printerCost: number;      // стоимость принтера (₽)
  printerLifespan: number;  // ресурс принтера (часов)
  maintenanceCost: number;  // обслуживание в год (₽)
  maintenanceHoursPerYear: number; // часов печати в год
}

export interface ElectricityParams {
  powerConsumption: number; // потребление Вт
  electricityRate: number;  // тариф ₽/кВт·ч
  printDuration: number;    // время печати (часов)
}

export interface PostProcessingParams {
  removalTime: number;      // время снятия (мин)
  removalRate: number;      // ставка работы (₽/час)
  paintingCost: number;     // стоимость покраски (₽)
  assemblyTime: number;     // время сборки (мин)
}

export interface PricingParams {
  profitMargin: number;     // наценка %
  overhead: number;         // накладные расходы % (аренда, упаковка)
  quantity: number;         // количество изделий
}

export interface CalculationInput {
  name: string;
  filament: FilamentParams;
  printer: PrinterParams;
  electricity: ElectricityParams;
  postProcessing: PostProcessingParams;
  pricing: PricingParams;
}

export interface CostBreakdown {
  filamentCost: number;
  printerDepreciation: number;
  maintenanceCost: number;
  electricityCost: number;
  postProcessingCost: number;
  overheadCost: number;
  totalCostPerUnit: number;
  profitPerUnit: number;
  sellingPricePerUnit: number;
  totalRevenue: number;
  totalProfit: number;
}

export interface CalculationResult {
  id: string;
  name: string;
  createdAt: string;
  input: CalculationInput;
  breakdown: CostBreakdown;
}

export type Currency = '₽' | '$' | '€';

export interface AppSettings {
  currency: Currency;
  language: 'ru' | 'en';
}

// ── Профили ─────────────────────────────────────────────────────

export interface FilamentProfile {
  id: string;
  name: string;         // напр. "PLA+ Bambu White"
  material: string;     // PLA, ABS, PETG, TPU, ASA...
  color: string;        // цвет для метки
  spoolWeight: number;
  spoolPrice: number;
  createdAt: string;
}

export interface PrinterProfile {
  id: string;
  name: string;         // напр. "Bambu Lab X1C"
  printerCost: number;
  printerLifespan: number;
  maintenanceCost: number;
  maintenanceHoursPerYear: number;
  powerConsumption: number; // Вт — у каждого принтера своё
  createdAt: string;
}
