import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { CalculationInput } from '../../types/calculation';
import { NumberInput } from '../UI/NumberInput';
import { SliderInput } from '../UI/SliderInput';
import { SectionCard } from '../UI/SectionCard';
import { useI18n } from '../../i18n';

interface Props {
  data: CalculationInput['pricing'];
  onChange: <K extends keyof CalculationInput['pricing']>(key: K, value: CalculationInput['pricing'][K]) => void;
}

export function PricingSection({ data, onChange }: Props) {
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SectionCard title={t.pricing.title} icon={TrendingUp} iconColor="text-green-400" collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)}>
      <SliderInput label={t.pricing.profitMargin} value={data.profitMargin} onChange={v => onChange('profitMargin', v)} min={0} max={500} step={5} unit="%" />
      <SliderInput label={t.pricing.overhead} value={data.overhead} onChange={v => onChange('overhead', v)} min={0} max={50} step={1} unit="%" />
      <NumberInput label={t.pricing.quantity} value={data.quantity} onChange={v => onChange('quantity', Math.max(1, Math.round(v)))} unit={t.units.pcs} min={1} step={1} hint={t.pricing.forRevenue} />
    </SectionCard>
  );
}
