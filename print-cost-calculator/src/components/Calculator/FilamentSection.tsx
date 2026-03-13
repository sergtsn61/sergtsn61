import { useState } from 'react';
import { Package, BookOpen } from 'lucide-react';
import { CalculationInput, FilamentProfile } from '../../types/calculation';
import { NumberInput } from '../UI/NumberInput';
import { SliderInput } from '../UI/SliderInput';
import { SectionCard } from '../UI/SectionCard';
import { Modal } from '../UI/Modal';
import { FilamentLibrary } from '../Library/FilamentLibrary';
import { loadFilamentProfiles } from '../../utils/storage';
import { useI18n } from '../../i18n';

interface Props {
  data: CalculationInput['filament'];
  onChange: <K extends keyof CalculationInput['filament']>(key: K, value: CalculationInput['filament'][K]) => void;
}

export function FilamentSection({ data, onChange }: Props) {
  const { t, currency } = useI18n();
  const [collapsed, setCollapsed] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [profiles, setProfiles] = useState<FilamentProfile[]>(() => loadFilamentProfiles());

  const pricePerGram = data.spoolWeight > 0 ? data.spoolPrice / data.spoolWeight : 0;
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
        title={t.filament.title}
        icon={Package}
        iconColor="text-orange-400"
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        action={
          <button
            onClick={e => { e.stopPropagation(); setShowLibrary(true); }}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-accent-primary transition-colors px-2 py-1 rounded-lg hover:bg-accent-muted"
            title={t.filament.library}
          >
            <BookOpen size={12} />
            <span>{t.filament.select}</span>
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label={t.filament.spoolWeight} value={data.spoolWeight} onChange={v => onChange('spoolWeight', v)} unit={t.units.g} min={100} step={50} required />
          <NumberInput label={t.filament.spoolPrice} value={data.spoolPrice} onChange={v => onChange('spoolPrice', v)} unit={currency} min={0} step={50} />
        </div>

        <NumberInput label={t.filament.usedWeight} value={data.usedWeight} onChange={v => onChange('usedWeight', v)} unit={t.units.g} min={0.1} step={1} hint={`${pricePerGram.toFixed(2)} ${t.units.rubGram}`} required />

        <SliderInput label={t.filament.wasteFactor} value={data.wasteFactor} onChange={v => onChange('wasteFactor', v)} min={0} max={50} step={1} unit="%" />

        <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-accent-muted border border-accent-primary/20">
          <span className="text-xs text-text-secondary">{t.filament.effectiveUsage}</span>
          <span className="text-sm font-semibold text-accent-primary">
            {effectiveWeight.toFixed(1)} {t.units.g} → {filamentCost.toFixed(2)} {currency}
          </span>
        </div>
      </SectionCard>

      {showLibrary && (
        <Modal title={t.filament.library} onClose={() => setShowLibrary(false)}>
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
