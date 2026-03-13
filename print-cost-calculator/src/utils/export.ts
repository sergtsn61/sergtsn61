import jsPDF from 'jspdf';
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

  const escapeCSV = (val: string | number): string => {
    let s = String(val).replace(/"/g, '""');
    // Защита от formula injection в Excel
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return `"${s}"`;
  };

  const csv = [headers, ...rows]
    .map(row => row.map(escapeCSV).join(','))
    .join('\n');

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `3d_print_costs_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSingleToPDF(result: CalculationResult): void {
  try {
  const { input, breakdown } = result;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const created = new Date(result.createdAt);
  const date = isNaN(created.getTime()) ? 'н/д' : created.toLocaleDateString('ru-RU');
  const truncate = (s: string, max: number) => s.length > max ? s.slice(0, max - 1) + '…' : s;

  const orange: [number, number, number] = [255, 107, 43];
  const dark:   [number, number, number] = [26, 26, 46];
  const gray:   [number, number, number] = [100, 100, 120];

  const W = 210;
  const PAD = 16;
  let y = 0;

  // ── Шапка ──────────────────────────────────────────────────────
  doc.setFillColor(...orange);
  doc.rect(0, 0, W, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(truncate(result.name || '3D-печать', 60), PAD, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(255, 220, 200);
  doc.text(`Расчёт себестоимости  •  ${date}`, PAD, 21);

  y = 38;

  // ── Секция-хелпер ──────────────────────────────────────────────
  const section = (title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...gray);
    doc.text(title.toUpperCase(), PAD, y);
    y += 2;
    doc.setDrawColor(220, 220, 230);
    doc.setLineWidth(0.3);
    doc.line(PAD, y, W - PAD, y);
    y += 5;
  };

  const row = (label: string, value: string, highlight = false) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...(highlight ? orange : dark));
    doc.text(label, PAD, y);
    doc.setFont('helvetica', highlight ? 'bold' : 'normal');
    doc.setTextColor(...(highlight ? orange : dark));
    doc.text(value, W - PAD, y, { align: 'right' });
    y += 7;
  };

  // ── Параметры ──────────────────────────────────────────────────
  section('Параметры печати');
  row('Расход филамента', `${input.filament.usedWeight} г (брак ${input.filament.wasteFactor}%)`);
  row('Цена катушки', `${input.filament.spoolPrice} руб. / ${input.filament.spoolWeight} г`);
  row('Время печати', `${input.electricity.printDuration} ч`);
  row('Электроэнергия', `${input.electricity.powerConsumption} Вт • ${input.electricity.electricityRate} руб./кВт·ч`);
  row('Количество изделий', `${input.pricing.quantity} шт.`);
  row('Наценка', `${input.pricing.profitMargin}%`);
  y += 2;

  // ── Структура себестоимости ────────────────────────────────────
  section('Структура себестоимости');
  row('Филамент',             formatCurrency(breakdown.filamentCost));
  row('Амортизация принтера', formatCurrency(breakdown.printerDepreciation));
  row('Обслуживание',         formatCurrency(breakdown.maintenanceCost));
  row('Электроэнергия',       formatCurrency(breakdown.electricityCost));
  row('Постобработка',        formatCurrency(breakdown.postProcessingCost));
  row('Накладные расходы',    formatCurrency(breakdown.overheadCost));
  y += 2;

  // ── Итог ───────────────────────────────────────────────────────
  doc.setFillColor(255, 247, 244);
  doc.setDrawColor(...orange);
  doc.setLineWidth(0.5);
  doc.roundedRect(PAD, y, W - PAD * 2, 48, 3, 3, 'FD');
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text('Цена продажи (1 шт.)', PAD + 6, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...orange);
  doc.text(formatCurrency(breakdown.sellingPricePerUnit), PAD + 6, y);
  y += 10;

  // 2 колонки
  const col1x = PAD + 6;
  const col2x = W / 2 + 4;

  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text('Себестоимость / шт.', col1x, y);
  doc.text('Прибыль / шт.', col2x, y);
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...dark);
  doc.text(formatCurrency(breakdown.totalCostPerUnit), col1x, y);
  doc.setTextColor(34, 197, 94);
  doc.text(formatCurrency(breakdown.profitPerUnit), col2x, y);

  if (input.pricing.quantity > 1) {
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text(`Выручка (${input.pricing.quantity} шт.)`, col1x, y);
    doc.text('Прибыль суммарно', col2x, y);
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...dark);
    doc.text(formatCurrency(breakdown.totalRevenue), col1x, y);
    doc.setTextColor(34, 197, 94);
    doc.text(formatCurrency(breakdown.totalProfit), col2x, y);
  }

  // ── Подвал ─────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 200);
  doc.text('3D Print Cost Calculator', PAD, 287);
  doc.text(new Date().toLocaleString('ru-RU'), W - PAD, 287, { align: 'right' });

  // ── Скачать ────────────────────────────────────────────────────
  const filename = `${(result.name || '3d-print').replace(/[^a-zа-яёА-ЯЁ0-9_\- ]/gi, '').trim() || '3d-print'}_${date.replace(/\./g, '-')}.pdf`;
  doc.save(filename);
  } catch (err) {
    console.error('PDF export failed:', err);
    alert('Не удалось создать PDF. Попробуйте ещё раз.');
  }
}
