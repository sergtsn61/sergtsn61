import { CalculationResult } from '../types/calculation';
import { formatCurrency } from './calculator';

export function exportToCSV(results: CalculationResult[]): void {
  const headers = [
    'Название', 'Дата',
    'Филамент (г)', 'Цена катушки (₽)', 'Расход (г)',
    'Время печати (ч)', 'Мощность (Вт)', 'Тариф (₽/кВт·ч)',
    'Себестоимость филамента (₽)', 'Амортизация принтера (₽)', 'Электроэнергия (₽)',
    'Постобработка (₽)', 'Накладные (₽)', 'Итого себестоимость (₽)',
    'Наценка (%)', 'Цена продажи (₽)', 'Прибыль (₽)', 'Кол-во', 'Выручка (₽)'
  ];

  const rows = results.map(r => {
    const { input, breakdown } = r;
    return [
      r.name,
      new Date(r.createdAt).toLocaleDateString('ru-RU'),
      input.filament.spoolWeight,
      input.filament.spoolPrice,
      input.filament.usedWeight,
      input.electricity.printDuration,
      input.electricity.powerConsumption,
      input.electricity.electricityRate,
      breakdown.filamentCost.toFixed(2),
      breakdown.printerDepreciation.toFixed(2),
      breakdown.electricityCost.toFixed(2),
      breakdown.postProcessingCost.toFixed(2),
      breakdown.overheadCost.toFixed(2),
      breakdown.totalCostPerUnit.toFixed(2),
      input.pricing.profitMargin,
      breakdown.sellingPricePerUnit.toFixed(2),
      breakdown.profitPerUnit.toFixed(2),
      input.pricing.quantity,
      breakdown.totalRevenue.toFixed(2),
    ];
  });

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `3d_print_costs_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportSingleToPDF(result: CalculationResult): void {
  const { input, breakdown } = result;
  const date = new Date(result.createdAt).toLocaleDateString('ru-RU');

  const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>${result.name} — Расчёт себестоимости 3D печати</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, Arial, sans-serif; background: #fff; color: #1a1a2e; padding: 40px; }
  h1 { font-size: 22px; font-weight: 700; color: #ff6b2b; margin-bottom: 4px; }
  .subtitle { color: #666; font-size: 13px; margin-bottom: 32px; }
  .section { margin-bottom: 24px; }
  .section h2 { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #999; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee; }
  .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
  .row .label { color: #555; }
  .row .value { font-weight: 500; color: #1a1a2e; }
  .result-box { background: #fff7f4; border: 2px solid #ff6b2b; border-radius: 12px; padding: 20px; margin-top: 24px; }
  .result-box .big { font-size: 32px; font-weight: 700; color: #ff6b2b; }
  .result-box .label { font-size: 13px; color: #888; margin-bottom: 4px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
  .grid-item { background: #f9f9f9; border-radius: 8px; padding: 12px; }
  .grid-item .v { font-size: 18px; font-weight: 600; color: #1a1a2e; }
  .grid-item .l { font-size: 12px; color: #888; margin-top: 2px; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
  <h1>${result.name}</h1>
  <div class="subtitle">Расчёт себестоимости 3D-печати • ${date}</div>

  <div class="section">
    <h2>Параметры</h2>
    <div class="row"><span class="label">Расход филамента</span><span class="value">${input.filament.usedWeight} г (брак ${input.filament.wasteFactor}%)</span></div>
    <div class="row"><span class="label">Цена катушки</span><span class="value">${input.filament.spoolPrice} ₽ / ${input.filament.spoolWeight} г</span></div>
    <div class="row"><span class="label">Время печати</span><span class="value">${input.electricity.printDuration} ч</span></div>
    <div class="row"><span class="label">Потребление</span><span class="value">${input.electricity.powerConsumption} Вт • ${input.electricity.electricityRate} ₽/кВт·ч</span></div>
    <div class="row"><span class="label">Количество</span><span class="value">${input.pricing.quantity} шт.</span></div>
    <div class="row"><span class="label">Наценка</span><span class="value">${input.pricing.profitMargin}%</span></div>
  </div>

  <div class="section">
    <h2>Структура себестоимости</h2>
    <div class="row"><span class="label">Филамент</span><span class="value">${formatCurrency(breakdown.filamentCost)}</span></div>
    <div class="row"><span class="label">Амортизация принтера</span><span class="value">${formatCurrency(breakdown.printerDepreciation)}</span></div>
    <div class="row"><span class="label">Обслуживание</span><span class="value">${formatCurrency(breakdown.maintenanceCost)}</span></div>
    <div class="row"><span class="label">Электроэнергия</span><span class="value">${formatCurrency(breakdown.electricityCost)}</span></div>
    <div class="row"><span class="label">Постобработка</span><span class="value">${formatCurrency(breakdown.postProcessingCost)}</span></div>
    <div class="row"><span class="label">Накладные расходы</span><span class="value">${formatCurrency(breakdown.overheadCost)}</span></div>
  </div>

  <div class="result-box">
    <div class="label">Цена продажи (1 шт.)</div>
    <div class="big">${formatCurrency(breakdown.sellingPricePerUnit)}</div>
    <div class="grid">
      <div class="grid-item"><div class="v">${formatCurrency(breakdown.totalCostPerUnit)}</div><div class="l">Себестоимость / шт.</div></div>
      <div class="grid-item"><div class="v">${formatCurrency(breakdown.profitPerUnit)}</div><div class="l">Прибыль / шт.</div></div>
      <div class="grid-item"><div class="v">${formatCurrency(breakdown.totalRevenue)}</div><div class="l">Выручка (${input.pricing.quantity} шт.)</div></div>
      <div class="grid-item"><div class="v">${formatCurrency(breakdown.totalProfit)}</div><div class="l">Прибыль суммарно</div></div>
    </div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  }
}
