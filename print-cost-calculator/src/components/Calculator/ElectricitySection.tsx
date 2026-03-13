import { useState } from 'react';
import { Zap } from 'lucide-react';
import { CalculationInput } from '../../types/calculation';
import { NumberInput } from '../UI/NumberInput';
import { SectionCard } from '../UI/SectionCard';

interface Props {
  data: CalculationInput['electricity'];
  onChange: <K extends keyof CalculationInput['electricity']>(key: K, value: CalculationInput['electricity'][K]) => void;
}

export function ElectricitySection({ data, onChange }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const cost = (data.powerConsumption / 1000) * data.electricityRate * data.printDuration;
  const hours = Math.floor(data.printDuration);
  const minutes = Math.round((data.printDuration - hours) * 60);

  return (
    <SectionCard
      title="Электроэнергия и время"
      icon={Zap}
      iconColor="text-yellow-400"
      collapsed={collapsed}
      onToggle={() => setCollapsed(!collapsed)}
    >
      <NumberInput
        label="Время печати"
        value={data.printDuration}
        onChange={v => onChange('printDuration', v)}
        unit="ч"
        min={0.1}
        step={0.5}
        hint={hours > 0 ? `${hours}ч ${minutes}мин` : `${minutes}мин`}
      />

      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Потребление"
          value={data.powerConsumption}
          onChange={v => onChange('powerConsumption', v)}
          unit="Вт"
          min={50}
          step={10}
        />
        <NumberInput
          label="Тариф"
          value={data.electricityRate}
          onChange={v => onChange('electricityRate', v)}
          unit="₽/кВт"
          min={0.1}
          step={0.1}
        />
      </div>

      <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
        <span className="text-xs text-text-secondary">Стоимость электроэнергии</span>
        <span className="text-sm font-semibold text-yellow-400">{cost.toFixed(2)} ₽</span>
      </div>
    </SectionCard>
  );
}
