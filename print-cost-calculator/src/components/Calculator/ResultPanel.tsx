import { Save, FileDown, RotateCcw } from 'lucide-react';
import { CostBreakdown, CalculationInput } from '../../types/calculation';
import { formatCurrency } from '../../utils/calculator';

interface ResultPanelProps {
  breakdown: CostBreakdown;
  pricing: CalculationInput['pricing'];
  onSave: () => void;
  onExportPDF: () => void;
  onReset: () => void;
  savedId: string | null;
}

interface BarSegmentProps {
  value: number;
  total: number;
  color: string;
  label: string;
}

function BarSegment({ value, total, color, label }: BarSegmentProps) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  if (pct < 0.5) return null;
  return (
    <div
      title={`${label}: ${formatCurrency(value)} (${pct.toFixed(1)}%)`}
      className={`h-full ${color} transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
      style={{ width: `${pct}%` }}
    />
  );
}

export function ResultPanel({ breakdown, pricing, onSave, onExportPDF, onReset, savedId }: ResultPanelProps) {
  const costItems = [
    { label: 'Филамент', value: breakdown.filamentCost, color: 'bg-orange-400', textColor: 'text-orange-400' },
    { label: 'Принтер', value: breakdown.printerDepreciation + breakdown.maintenanceCost, color: 'bg-blue-400', textColor: 'text-blue-400' },
    { label: 'Электроэнергия', value: breakdown.electricityCost, color: 'bg-yellow-400', textColor: 'text-yellow-400' },
    { label: 'Постобработка', value: breakdown.postProcessingCost, color: 'bg-purple-400', textColor: 'text-purple-400' },
    { label: 'Накладные', value: breakdown.overheadCost, color: 'bg-gray-400', textColor: 'text-gray-400' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Главный результат */}
      <div className="p-5 border-b border-border-subtle">
        <div className="text-center">
          <div className="text-xs text-text-muted uppercase tracking-widest mb-1">Цена продажи</div>
          <div
            className="text-4xl font-bold tabular-nums animate-pulse-glow"
            style={{ color: '#FF6B2B', textShadow: '0 0 20px rgba(255,107,43,0.4)' }}
          >
            {formatCurrency(breakdown.sellingPricePerUnit)}
          </div>
          <div className="text-xs text-text-muted mt-1">за 1 изделие</div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-bg-secondary rounded-xl p-3 text-center">
            <div className="text-lg font-semibold text-text-primary tabular-nums">
              {formatCurrency(breakdown.totalCostPerUnit)}
            </div>
            <div className="text-xs text-text-muted mt-0.5">Себестоимость</div>
          </div>
          <div className="bg-bg-secondary rounded-xl p-3 text-center">
            <div className="text-lg font-semibold text-success tabular-nums">
              {formatCurrency(breakdown.profitPerUnit)}
            </div>
            <div className="text-xs text-text-muted mt-0.5">Прибыль</div>
          </div>
        </div>

        {pricing.quantity > 1 && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-bg-secondary rounded-xl p-3 text-center">
              <div className="text-base font-semibold text-text-primary tabular-nums">
                {formatCurrency(breakdown.totalRevenue)}
              </div>
              <div className="text-xs text-text-muted mt-0.5">Выручка × {pricing.quantity}</div>
            </div>
            <div className="bg-bg-secondary rounded-xl p-3 text-center">
              <div className="text-base font-semibold text-success tabular-nums">
                {formatCurrency(breakdown.totalProfit)}
              </div>
              <div className="text-xs text-text-muted mt-0.5">Прибыль суммарно</div>
            </div>
          </div>
        )}
      </div>

      {/* Диаграмма структуры себестоимости */}
      <div className="p-4 border-b border-border-subtle">
        <div className="text-xs text-text-muted uppercase tracking-widest mb-3">Структура себестоимости</div>

        {/* Бар-чарт */}
        <div className="h-2.5 rounded-full bg-bg-secondary overflow-hidden flex mb-3">
          {costItems.map(item => (
            <BarSegment
              key={item.label}
              value={item.value}
              total={breakdown.totalCostPerUnit}
              color={item.color}
              label={item.label}
            />
          ))}
        </div>

        {/* Легенда */}
        <div className="space-y-2">
          {costItems.map(item => {
            const pct = breakdown.totalCostPerUnit > 0
              ? (item.value / breakdown.totalCostPerUnit) * 100
              : 0;
            return (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-text-secondary">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${item.textColor}`}>{pct.toFixed(1)}%</span>
                  <span className="text-xs text-text-muted tabular-nums w-20 text-right">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="p-4 space-y-2 mt-auto">
        <button
          onClick={onSave}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${
            savedId
              ? 'bg-success/20 text-success border border-success/30'
              : 'btn-primary'
          }`}
        >
          <Save size={15} />
          {savedId ? 'Сохранено!' : 'Сохранить расчёт'}
        </button>

        <div className="flex gap-2">
          <button
            onClick={onExportPDF}
            className="flex-1 flex items-center justify-center gap-2 btn-secondary py-2.5 text-xs"
          >
            <FileDown size={13} />
            PDF
          </button>
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 btn-secondary py-2.5 text-xs"
          >
            <RotateCcw size={13} />
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
}
