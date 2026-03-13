import { useState } from 'react';
import { Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { PrinterProfile } from '../../types/calculation';
import { savePrinterProfile, deletePrinterProfile } from '../../utils/storage';
import { NumberInput } from '../UI/NumberInput';
import { PRINTER_PRESETS } from '../../data/presets';
import { useI18n } from '../../i18n';

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
  const { t, currency } = useI18n();
  const [adding, setAdding] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [form, setForm] = useState(() => blankProfile());

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

  const handleAddPreset = (preset: typeof PRINTER_PRESETS[number]) => {
    const profile: PrinterProfile = {
      ...preset,
      id: `prt_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    savePrinterProfile(profile);
    onRefresh();
  };

  const hourlyRate = form.printerLifespan > 0 ? (form.printerCost / form.printerLifespan).toFixed(2) : '0.00';

  return (
    <div className="space-y-3">
      {/* Saved profiles */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {profiles.length === 0 && !adding && !showPresets && (
          <p className="text-xs text-text-muted text-center py-4">{t.printer.noProfiles}</p>
        )}
        {profiles.map(p => {
          const rate = p.printerLifespan > 0 ? (p.printerCost / p.printerLifespan).toFixed(1) : '0';
          return (
            <div key={p.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all group ${selectedId === p.id ? 'border-blue-400/50 bg-blue-500/10' : 'border-border-subtle hover:border-border-default bg-bg-secondary'}`} onClick={() => onSelect(p)}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${selectedId === p.id ? 'bg-blue-500/20' : 'bg-bg-hover'}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><path d="M12 12v4M10 14h4"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{p.name}</p>
                <p className="text-xs text-text-muted">{p.printerCost.toLocaleString()} {currency} · {rate} {t.units.rubHour} · {p.powerConsumption}{t.units.watts}</p>
              </div>
              {selectedId === p.id && <Check size={13} className="text-blue-400 shrink-0" />}
              <button onClick={e => { e.stopPropagation(); deletePrinterProfile(p.id); onRefresh(); }} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-error transition-all p-1"><Trash2 size={12} /></button>
            </div>
          );
        })}
      </div>

      {/* Presets */}
      {showPresets && (
        <div className="border border-border-default rounded-xl p-3 bg-bg-secondary animate-fade-in">
          <p className="text-xs font-medium text-text-secondary mb-2">
            <Sparkles size={11} className="inline mr-1 text-accent-primary" />
            {t.printer.select}
          </p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {PRINTER_PRESETS.map((preset, i) => {
              const alreadyAdded = profiles.some(p => p.name === preset.name);
              return (
                <button key={i} disabled={alreadyAdded} onClick={() => handleAddPreset(preset)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-all ${alreadyAdded ? 'opacity-40 cursor-not-allowed' : 'hover:bg-bg-hover cursor-pointer'}`}>
                  <span className="font-medium text-text-primary">{preset.name}</span>
                  <span className="text-text-muted">{preset.printerCost.toLocaleString()} {currency}</span>
                </button>
              );
            })}
          </div>
          <button onClick={() => setShowPresets(false)} className="w-full btn-secondary py-1.5 text-xs mt-2">{t.common.cancel}</button>
        </div>
      )}

      {/* Form */}
      {adding && (
        <div className="border border-border-default rounded-xl p-3 space-y-3 bg-bg-secondary">
          <input autoFocus type="text" placeholder={t.printer.namePlaceholder} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
          <div className="grid grid-cols-2 gap-2">
            <NumberInput label={t.printer.cost} value={form.printerCost} onChange={v => setForm(f => ({ ...f, printerCost: v }))} unit={currency} min={0} step={1000} />
            <NumberInput label={t.printer.lifespan} value={form.printerLifespan} onChange={v => setForm(f => ({ ...f, printerLifespan: v }))} unit={t.units.hours} min={100} step={500} hint={`${hourlyRate} ${t.units.rubHour}`} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput label={t.printer.maintenanceCost} value={form.maintenanceCost} onChange={v => setForm(f => ({ ...f, maintenanceCost: v }))} unit={currency} min={0} step={500} />
            <NumberInput label={t.printer.maintenanceHours} value={form.maintenanceHoursPerYear} onChange={v => setForm(f => ({ ...f, maintenanceHoursPerYear: v }))} unit={t.units.hours} min={1} step={100} />
          </div>
          <NumberInput label={t.printer.power} value={form.powerConsumption} onChange={v => setForm(f => ({ ...f, powerConsumption: v }))} unit={t.units.watts} min={50} step={10} />
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} className="flex-1 btn-primary py-2 text-xs">{t.common.save}</button>
            <button onClick={() => { setAdding(false); setForm(blankProfile()); }} className="flex-1 btn-secondary py-2 text-xs">{t.common.cancel}</button>
          </div>
        </div>
      )}

      {!adding && !showPresets && (
        <div className="flex gap-2">
          <button onClick={() => setAdding(true)} className="flex-1 flex items-center justify-center gap-2 btn-secondary py-2.5 text-xs">
            <Plus size={13} /> {t.printer.addPrinter}
          </button>
          <button onClick={() => setShowPresets(true)} className="flex items-center justify-center gap-1.5 btn-secondary py-2.5 px-3 text-xs">
            <Sparkles size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
