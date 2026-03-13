import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { PrinterProfile } from '../../types/calculation';
import { savePrinterProfile, deletePrinterProfile } from '../../utils/storage';
import { NumberInput } from '../UI/NumberInput';

interface Props {
  profiles: PrinterProfile[];
  onSelect: (p: PrinterProfile) => void;
  onRefresh: () => void;
  selectedId?: string;
}

const blankProfile = (): Omit<PrinterProfile, 'id' | 'createdAt'> => ({
  name: '',
  printerCost: 25000,
  printerLifespan: 5000,
  maintenanceCost: 3000,
  maintenanceHoursPerYear: 1000,
  powerConsumption: 200,
});

export function PrinterLibrary({ profiles, onSelect, onRefresh, selectedId }: Props) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(blankProfile());

  const handleSave = () => {
    if (!form.name.trim()) return;
    const profile: PrinterProfile = {
      ...form,
      id: `prt_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    savePrinterProfile(profile);
    onRefresh();
    setAdding(false);
    setForm(blankProfile());
  };

  const hourlyRate = form.printerLifespan > 0
    ? (form.printerCost / form.printerLifespan).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-3">
      {/* Список */}
      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
        {profiles.length === 0 && !adding && (
          <p className="text-xs text-text-muted text-center py-4">Принтеры не добавлены</p>
        )}
        {profiles.map(p => {
          const rate = p.printerLifespan > 0 ? (p.printerCost / p.printerLifespan).toFixed(1) : '0';
          return (
            <div
              key={p.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all group
                ${selectedId === p.id
                  ? 'border-blue-400/50 bg-blue-500/10'
                  : 'border-border-subtle hover:border-border-default bg-bg-secondary'
                }`}
              onClick={() => onSelect(p)}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${selectedId === p.id ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                  <path d="M12 12v4M10 14h4"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{p.name}</p>
                <p className="text-xs text-text-muted">{p.printerCost.toLocaleString('ru')} ₽ · {rate} ₽/ч · {p.powerConsumption}Вт</p>
              </div>
              {selectedId === p.id && <Check size={13} className="text-blue-400 shrink-0" />}
              <button
                onClick={e => { e.stopPropagation(); deletePrinterProfile(p.id); onRefresh(); }}
                className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-error transition-all p-1"
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Форма */}
      {adding ? (
        <div className="border border-border-default rounded-xl p-3 space-y-3 bg-bg-secondary">
          <input
            autoFocus
            type="text"
            placeholder="Название (напр. Bambu Lab X1C)"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="input-field"
          />

          <div className="grid grid-cols-2 gap-2">
            <NumberInput
              label="Стоимость принтера"
              value={form.printerCost}
              onChange={v => setForm(f => ({ ...f, printerCost: v }))}
              unit="₽" min={0} step={1000}
            />
            <NumberInput
              label="Ресурс"
              value={form.printerLifespan}
              onChange={v => setForm(f => ({ ...f, printerLifespan: v }))}
              unit="ч" min={100} step={500}
              hint={`${hourlyRate} ₽/ч`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <NumberInput
              label="Обслуживание/год"
              value={form.maintenanceCost}
              onChange={v => setForm(f => ({ ...f, maintenanceCost: v }))}
              unit="₽" min={0} step={500}
            />
            <NumberInput
              label="Часов/год"
              value={form.maintenanceHoursPerYear}
              onChange={v => setForm(f => ({ ...f, maintenanceHoursPerYear: v }))}
              unit="ч" min={1} step={100}
            />
          </div>

          <NumberInput
            label="Потребление"
            value={form.powerConsumption}
            onChange={v => setForm(f => ({ ...f, powerConsumption: v }))}
            unit="Вт" min={50} step={10}
          />

          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} className="flex-1 btn-primary py-2 text-xs">
              Сохранить
            </button>
            <button onClick={() => { setAdding(false); setForm(blankProfile()); }} className="flex-1 btn-secondary py-2 text-xs">
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-2 btn-secondary py-2.5 text-xs"
        >
          <Plus size={13} />
          Добавить принтер
        </button>
      )}
    </div>
  );
}
