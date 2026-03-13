import { CalculationInput, CostBreakdown, CalculationResult } from '../types/calculation';

export function calculateCosts(input: CalculationInput): CostBreakdown {
  const { filament, printer, electricity, postProcessing, pricing } = input;

  // Стоимость филамента с учётом брака
  const effectiveWeight = filament.usedWeight * (1 + filament.wasteFactor / 100);
  const pricePerGram = filament.spoolPrice / filament.spoolWeight;
  const filamentCost = pricePerGram * effectiveWeight;

  // Амортизация принтера
  const printerDepreciation = printer.printerLifespan > 0
    ? (printer.printerCost / printer.printerLifespan) * electricity.printDuration
    : 0;

  // Стоимость обслуживания за период печати
  const maintenanceCost = printer.maintenanceHoursPerYear > 0
    ? (printer.maintenanceCost / printer.maintenanceHoursPerYear) * electricity.printDuration
    : 0;

  // Стоимость электроэнергии
  const electricityCost = (electricity.powerConsumption / 1000) * electricity.electricityRate * electricity.printDuration;

  // Стоимость постобработки
  const removalCost = (postProcessing.removalTime / 60) * postProcessing.removalRate;
  const assemblyCost = (postProcessing.assemblyTime / 60) * postProcessing.removalRate;
  const postProcessingCost = removalCost + postProcessing.paintingCost + assemblyCost;

  // Базовая себестоимость единицы
  const baseCostPerUnit = filamentCost + printerDepreciation + maintenanceCost + electricityCost + postProcessingCost;

  // Накладные расходы
  const overheadCost = baseCostPerUnit * (pricing.overhead / 100);

  // Полная себестоимость
  const totalCostPerUnit = baseCostPerUnit + overheadCost;

  // Цена продажи
  const profitPerUnit = totalCostPerUnit * (pricing.profitMargin / 100);
  const sellingPricePerUnit = totalCostPerUnit + profitPerUnit;

  const totalRevenue = sellingPricePerUnit * pricing.quantity;
  const totalProfit = profitPerUnit * pricing.quantity;

  return {
    filamentCost,
    printerDepreciation,
    maintenanceCost,
    electricityCost,
    postProcessingCost,
    overheadCost,
    totalCostPerUnit,
    profitPerUnit,
    sellingPricePerUnit,
    totalRevenue,
    totalProfit,
  };
}

export function createCalculationResult(input: CalculationInput): CalculationResult {
  return {
    id: `calc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: input.name || `Расчёт ${new Date().toLocaleDateString('ru-RU')}`,
    createdAt: new Date().toISOString(),
    input,
    breakdown: calculateCosts(input),
  };
}

export function formatCurrency(value: number, currency = '₽'): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ' ' + currency;
}

export function formatNumber(value: number, decimals = 1): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
