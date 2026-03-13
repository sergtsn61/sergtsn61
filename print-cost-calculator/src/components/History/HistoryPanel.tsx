import { Trash2, Download, ExternalLink, Clock, BarChart2 } from 'lucide-react';
import { CalculationResult } from '../../types/calculation';
import { formatCurrency } from '../../utils/calculator';
import { exportToCSV, exportSingleToPDF } from '../../utils/export';

interface Props {
  history: CalculationResult[];
  onLoad: (result: CalculationResult) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({ history, onLoad, onDelete, onClear }: Props) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
        <div className="w-14 h-14 rounded-2xl bg-bg-card border border-border-subtle flex items-center justify-center mb-4">
          <Clock size={22} className="text-text-muted" />
        </div>
        <p className="text-sm font-medium text-text-secondary mb-1">История пуста</p>
        <p className="text-xs text-text-muted">Сохранённые расчёты появятся здесь</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 size={14} className="text-text-muted" />
          <span className="text-xs text-text-muted">{history.length} расчётов</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(history)}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent-primary transition-colors py-1 px-2 rounded-lg hover:bg-accent-muted"
          >
            <Download size={12} />
            CSV
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-error transition-colors py-1 px-2 rounded-lg hover:bg-red-500/10"
          >
            <Trash2 size={12} />
            Очистить
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-3 space-y-2">
        {history.map(result => {
          const date = new Date(result.createdAt);
          const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
          const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

          return (
            <div
              key={result.id}
              className="card p-3 hover:border-border-default transition-all duration-200 group cursor-pointer"
              onClick={() => onLoad(result)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {result.name || 'Без названия'}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {dateStr} в {timeStr} · {result.input.filament.usedWeight}г · {result.input.electricity.printDuration}ч
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-accent-primary">
                    {formatCurrency(result.breakdown.sellingPricePerUnit)}
                  </p>
                  <p className="text-xs text-text-muted">
                    с/с {formatCurrency(result.breakdown.totalCostPerUnit)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); onLoad(result); }}
                  className="flex items-center gap-1 text-xs text-text-secondary hover:text-accent-primary transition-colors"
                >
                  <ExternalLink size={11} />
                  Загрузить
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); exportSingleToPDF(result); }}
                  className="flex items-center gap-1 text-xs text-text-secondary hover:text-accent-primary transition-colors"
                >
                  <Download size={11} />
                  PDF
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(result.id); }}
                  className="flex items-center gap-1 text-xs text-text-secondary hover:text-error transition-colors ml-auto"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
