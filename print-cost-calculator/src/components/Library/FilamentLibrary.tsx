import { useState } from 'react';
import { Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { FilamentProfile } from '../../types/calculation';
import { saveFilamentProfile, deleteFilamentProfile } from '../../utils/storage';
import { NumberInput } from '../UI/NumberInput';
import { FILAMENT_PRESETS } from '../../data/presets';
import { useI18n } from '../../i18n';

const MATERIALS = ['PLA', 'PLA+', 'PETG', 'ABS', 'ASA', 'TPU', 'Nylon', 'PC', 'Resin', 'Other'];
const COLORS = ['#FF6B6B', '#FFA94D', '#FFD43B', '#69DB7C', '#4DABF7', '#9775FA', '#F783AC', '#CED4DA', '#FFFFFF', '#1A1A2E'];

interface Props {
  profiles: FilamentProfile[];
  onSelect: (p: FilamentProfile) => void;
  onRefresh: () => void;
  selectedId?: string;
}

const blankProfile = (): Omit<FilamentProfile, 'id' | 'createdAt'> => ({
  name: '', material: 'PLA', color: '#FF6B2B', spoolWeight: 1000, spoolPrice: 1500,
});

export function FilamentLibrary({ profiles, onSelect, onRefresh, selectedId }: Props) {
  const { t, currency } = useI18n();
  const [adding, setAdding] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [form, setForm] = useState(() => blankProfile());

  const handleSave = () => {
    if (!form.name.trim()) return;
    const profile: FilamentProfile = { ...form, id: `fil_${Date.now()}`, createdAt: new Date().toISOString() };
    saveFilamentProfile(profile);
    onRefresh();
    setAdding(false);
    setForm(blankProfile());
  };

  const handleAddPreset = (preset: typeof FILAMENT_PRESETS[number]) => {
    const profile: FilamentProfile = {
      ...preset,
      id: `fil_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    saveFilamentProfile(profile);
    onRefresh();
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {profiles.length === 0 && !adding && !showPresets && (
          <p className="text-xs text-text-muted text-center py-4">{t.filament.noProfiles}</p>
        )}
        {profiles.map(p => (
          <div key={p.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all group ${selectedId === p.id ? 'border-accent-primary/50 bg-accent-muted' : 'border-border-subtle hover:border-border-default bg-bg-secondary'}`} onClick={() => onSelect(p)}>
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{p.name}</p>
              <p className="text-xs text-text-muted">{p.material} · {p.spoolWeight}{t.units.g} · {p.spoolPrice} {currency}</p>
            </div>
            {selectedId === p.id && <Check size={13} className="text-accent-primary shrink-0" />}
            <button onClick={e => { e.stopPropagation(); deleteFilamentProfile(p.id); onRefresh(); }} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-error transition-all p-1"><Trash2 size={12} /></button>
          </div>
        ))}
      </div>

      {showPresets && (
        <div className="border border-border-default rounded-xl p-3 bg-bg-secondary animate-fade-in">
          <p className="text-xs font-medium text-text-secondary mb-2">
            <Sparkles size={11} className="inline mr-1 text-accent-primary" />
            {t.filament.select}
          </p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {FILAMENT_PRESETS.map((preset, i) => {
              const alreadyAdded = profiles.some(p => p.name === preset.name);
              return (
                <button key={i} disabled={alreadyAdded} onClick={() => handleAddPreset(preset)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-all ${alreadyAdded ? 'opacity-40 cursor-not-allowed' : 'hover:bg-bg-hover cursor-pointer'}`}>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: preset.color }} />
                  <span className="font-medium text-text-primary flex-1">{preset.name}</span>
                  <span className="text-text-muted">{preset.spoolPrice} {currency}</span>
                </button>
              );
            })}
          </div>
          <button onClick={() => setShowPresets(false)} className="w-full btn-secondary py-1.5 text-xs mt-2">{t.common.cancel}</button>
        </div>
      )}

      {adding && (
        <div className="border border-border-default rounded-xl p-3 space-y-3 bg-bg-secondary">
          <input autoFocus type="text" placeholder={t.filament.namePlaceholder} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary">{t.filament.material}</label>
              <select value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} className="input-field">
                {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary">{t.filament.colorLabel}</label>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} className={`w-5 h-5 rounded-full transition-transform ${form.color === c ? 'ring-2 ring-accent-primary scale-110' : ''}`} style={{ background: c, border: c === '#FFFFFF' ? '1px solid rgba(0,0,0,0.15)' : 'none' }} />
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput label={t.filament.spoolWeight} value={form.spoolWeight} onChange={v => setForm(f => ({ ...f, spoolWeight: v }))} unit={t.units.g} min={100} step={50} />
            <NumberInput label={t.filament.spoolPrice} value={form.spoolPrice} onChange={v => setForm(f => ({ ...f, spoolPrice: v }))} unit={currency} min={0} step={50} />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} className="flex-1 btn-primary py-2 text-xs">{t.common.save}</button>
            <button onClick={() => { setAdding(false); setForm(blankProfile()); }} className="flex-1 btn-secondary py-2 text-xs">{t.common.cancel}</button>
          </div>
        </div>
      )}

      {!adding && !showPresets && (
        <div className="flex gap-2">
          <button onClick={() => setAdding(true)} className="flex-1 flex items-center justify-center gap-2 btn-secondary py-2.5 text-xs">
            <Plus size={13} /> {t.filament.addFilament}
          </button>
          <button onClick={() => setShowPresets(true)} className="flex items-center justify-center gap-1.5 btn-secondary py-2.5 px-3 text-xs">
            <Sparkles size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
