import { useState } from 'react';
import { Package, BookOpen } from 'lucide-react';
import { CalculationInput, FilamentProfile } from '../../types/calculation';
import { NumberInput } from '../UI/NumberInput';
import { SliderInput } from '../UI/SliderInput';
import { SectionCard } from '../UI/SectionCard';
import { Modal } from '../UI/Modal';
import { FilamentLibrary } from '../Library/FilamentLibrary';
import { loadFilamentProfiles } from '../../utils/storage';

interface Props {
  data: CalculationInput['filament'];
  onChange: <K extends keyof CalculationInput['filament']>(key: K, value: CalculationInput['filament'][K]) => void;
}

export function FilamentSection({ data, onChange }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [profiles, setProfiles] = useState<FilamentProfile[]>(() => loadFilamentProfiles());

  const pricePerGram = data.spoolPrice / data.spoolWeight;
  const effectiveWeight = data.usedWeight * (1 + data.wasteFactor / 100);
  const filamentCost = pricePerGram * effectiveWeight;

  const handleSelectProfile = (p: FilamentProfile) => {
    onChange('spoolWeight', p.spoolWeight);
    onChange('spoolPrice', p.spoolPrice);
    setShowLibrary(false);
  };

  return (
    <>
      <SectionCard
        title="Филамент"
        icon={Package}
        iconColor="text-orange-400"
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        action={
          <button
            onClick={e => { e.stopPropagation(); setShowLibrary(true); }}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-accent-primary transition-colors px-2 py-1 rounded-lg hover:bg-accent-muted"
            title="Библиотека филаментов"
          >
            <BookOpen size={12} />
            <span>Выбрать</span>
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Вес катушки"
            value={data.spoolWeight}
            onChange={v => onChange('spoolWeight', v)}
            unit="г"
            min={100}
            step={50}
          />
          <NumberInput
            label="Цена катушки"
            value={data.spoolPrice}
            onChange={v => onChange('spoolPrice', v)}
            unit="₽"
            min={0}
            step={50}
          />
        </div>

        <NumberInput
          label="Расход на изделие"
          value={data.usedWeight}
          onChange={v => onChange('usedWeight', v)}
          unit="г"
          min={0.1}
          step={1}
          hint={`${pricePerGram.toFixed(2)} ₽/г`}
        />

        <SliderInput
          label="Брак и поддержки"
          value={data.wasteFactor}
          onChange={v => onChange('wasteFactor', v)}
          min={0}
          max={50}
          step={1}
          unit="%"
        />

        <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-accent-muted border border-accent-primary/20">
          <span className="text-xs text-text-secondary">Фактический расход</span>
          <span className="text-sm font-semibold text-accent-primary">
            {effectiveWeight.toFixed(1)} г → {filamentCost.toFixed(2)} ₽
          </span>
        </div>
      </SectionCard>

      {showLibrary && (
        <Modal title="Библиотека филаментов" onClose={() => setShowLibrary(false)}>
          <FilamentLibrary
            profiles={profiles}
            onSelect={handleSelectProfile}
            onRefresh={() => setProfiles(loadFilamentProfiles())}
          />
        </Modal>
      )}
    </>
  );
}
