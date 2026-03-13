import { useState } from 'react';
import { Paintbrush } from 'lucide-react';
import { CalculationInput } from '../../types/calculation';
import { NumberInput } from '../UI/NumberInput';
import { SectionCard } from '../UI/SectionCard';

interface Props {
  data: CalculationInput['postProcessing'];
  onChange: <K extends keyof CalculationInput['postProcessing']>(key: K, value: CalculationInput['postProcessing'][K]) => void;
}

export function PostProcessingSection({ data, onChange }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const laborCost = ((data.removalTime + data.assemblyTime) / 60) * data.removalRate;
  const totalCost = laborCost + data.paintingCost;

  return (
    <SectionCard
      title="Постобработка"
      icon={Paintbrush}
      iconColor="text-purple-400"
      collapsed={collapsed}
      onToggle={() => setCollapsed(!collapsed)}
    >
      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Время снятия"
          value={data.removalTime}
          onChange={v => onChange('removalTime', v)}
          unit="мин"
          min={0}
          step={5}
        />
        <NumberInput
          label="Ставка работы"
          value={data.removalRate}
          onChange={v => onChange('removalRate', v)}
          unit="₽/ч"
          min={0}
          step={50}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Покраска/отделка"
          value={data.paintingCost}
          onChange={v => onChange('paintingCost', v)}
          unit="₽"
          min={0}
          step={50}
        />
        <NumberInput
          label="Сборка"
          value={data.assemblyTime}
          onChange={v => onChange('assemblyTime', v)}
          unit="мин"
          min={0}
          step={5}
        />
      </div>

      <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
        <span className="text-xs text-text-secondary">Итого постобработка</span>
        <span className="text-sm font-semibold text-purple-400">{totalCost.toFixed(2)} ₽</span>
      </div>
    </SectionCard>
  );
}
