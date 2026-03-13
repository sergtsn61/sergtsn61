import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { CalculationInput } from '../../types/calculation';
import { NumberInput } from '../UI/NumberInput';
import { SliderInput } from '../UI/SliderInput';
import { SectionCard } from '../UI/SectionCard';

interface Props {
  data: CalculationInput['pricing'];
  onChange: <K extends keyof CalculationInput['pricing']>(key: K, value: CalculationInput['pricing'][K]) => void;
}

export function PricingSection({ data, onChange }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SectionCard
      title="Ценообразование"
      icon={TrendingUp}
      iconColor="text-green-400"
      collapsed={collapsed}
      onToggle={() => setCollapsed(!collapsed)}
    >
      <SliderInput
        label="Наценка"
        value={data.profitMargin}
        onChange={v => onChange('profitMargin', v)}
        min={0}
        max={500}
        step={5}
        unit="%"
      />

      <SliderInput
        label="Накладные расходы (аренда, упаковка)"
        value={data.overhead}
        onChange={v => onChange('overhead', v)}
        min={0}
        max={50}
        step={1}
        unit="%"
      />

      <NumberInput
        label="Количество изделий"
        value={data.quantity}
        onChange={v => onChange('quantity', Math.max(1, Math.round(v)))}
        unit="шт."
        min={1}
        step={1}
        hint="для общей выручки"
      />
    </SectionCard>
  );
}
