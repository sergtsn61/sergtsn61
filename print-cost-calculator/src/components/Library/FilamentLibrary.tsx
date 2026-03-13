import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { FilamentProfile } from '../../types/calculation';
import { saveFilamentProfile, deleteFilamentProfile } from '../../utils/storage';
import { NumberInput } from '../UI/NumberInput';

const MATERIALS = ['PLA', 'PLA+', 'PETG', 'ABS', 'ASA', 'TPU', 'Nylon', 'PC', 'Resin', 'Other'];
const COLORS = ['#FF6B6B', '#FFA94D', '#FFD43B', '#69DB7C', '#4DABF7', '#9775FA', '#F783AC', '#CED4DA', '#FFFFFF', '#1A1A2E'];

interface Props {
  profiles: FilamentProfile[];
  onSelect: (p: FilamentProfile) => void;
  onRefresh: () => void;
  selectedId?: string;
}

const blankProfile = (): Omit<FilamentProfile, 'id' | 'createdAt'> => ({
  name: '',
  material: 'PLA',
  color: '#FF6B2B',
  spoolWeight: 1000,
  spoolPrice: 1500,
});

export function FilamentLibrary({ profiles, onSelect, onRefresh, selectedId }: Props) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(blankProfile());

  const handleSave = () => {
    if (!form.name.trim()) return;
    const profile: FilamentProfile = {
      ...form,
      id: `fil_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    saveFilamentProfile(profile);
    onRefresh();
    setAdding(false);
    setForm(blankProfile());
  };

  return (
    <div className="space-y-3">
      {/* Список */}
      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
        {profiles.length === 0 && !adding && (
          <p className="text-xs text-text-muted text-center py-4">Профили не добавлены</p>
        )}
        {profiles.map(p => (
          <div
            key={p.id}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all group
              ${selectedId === p.id
                ? 'border-accent-primary/50 bg-accent-muted'
                : 'border-border-subtle hover:border-border-default bg-bg-secondary'
              }`}
            onClick={() => onSelect(p)}
          >
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{p.name}</p>
              <p className="text-xs text-text-muted">{p.material} · {p.spoolWeight}г · {p.spoolPrice} ₽</p>
            </div>
            {selectedId === p.id && <Check size={13} className="text-accent-primary shrink-0" />}
            <button
              onClick={e => { e.stopPropagation(); deleteFilamentProfile(p.id); onRefresh(); }}
              className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-error transition-all p-1"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Форма добавления */}
      {adding ? (
        <div className="border border-border-default rounded-xl p-3 space-y-3 bg-bg-secondary">
          <input
            autoFocus
            type="text"
            placeholder="Название (напр. PLA+ Bambu White)"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="input-field"
          />

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary">Материал</label>
              <select
                value={form.material}
                onChange={e => setForm(f => ({ ...f, material: e.target.value }))}
                className="input-field"
              >
                {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary">Цвет метки</label>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={`w-5 h-5 rounded-full transition-transform ${form.color === c ? 'ring-2 ring-white scale-110' : ''}`}
                    style={{ background: c, border: c === '#FFFFFF' ? '1px solid rgba(255,255,255,0.2)' : 'none' }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <NumberInput
              label="Вес катушки"
              value={form.spoolWeight}
              onChange={v => setForm(f => ({ ...f, spoolWeight: v }))}
              unit="г" min={100} step={50}
            />
            <NumberInput
              label="Цена катушки"
              value={form.spoolPrice}
              onChange={v => setForm(f => ({ ...f, spoolPrice: v }))}
              unit="₽" min={0} step={50}
            />
          </div>

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
          Добавить филамент
        </button>
      )}
    </div>
  );
}
