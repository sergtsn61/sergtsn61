import { useState } from 'react';
import { Printer } from 'lucide-react';
import { CalculationInput } from '../../types/calculation';
import { NumberInput } from '../UI/NumberInput';
import { SectionCard } from '../UI/SectionCard';

interface Props {
  data: CalculationInput['printer'];
  onChange: <K extends keyof CalculationInput['printer']>(key: K, value: CalculationInput['printer'][K]) => void;
}

export function PrinterSection({ data, onChange }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const hourlyDepreciation = data.printerLifespan > 0 ? data.printerCost / data.printerLifespan : 0;
  const hourlyMaintenance = data.maintenanceHoursPerYear > 0 ? data.maintenanceCost / data.maintenanceHoursPerYear : 0;

  return (
    <SectionCard
      title="Принтер"
      icon={Printer}
      iconColor="text-blue-400"
      collapsed={collapsed}
      onToggle={() => setCollapsed(!collapsed)}
    >
      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Стоимость принтера"
          value={data.printerCost}
          onChange={v => onChange('printerCost', v)}
          unit="₽"
          min={0}
          step={1000}
        />
        <NumberInput
          label="Ресурс принтера"
          value={data.printerLifespan}
          onChange={v => onChange('printerLifespan', v)}
          unit="ч"
          min={100}
          step={100}
          hint={`${hourlyDepreciation.toFixed(2)} ₽/ч`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Обслуживание в год"
          value={data.maintenanceCost}
          onChange={v => onChange('maintenanceCost', v)}
          unit="₽"
          min={0}
          step={100}
        />
        <NumberInput
          label="Часов печати в год"
          value={data.maintenanceHoursPerYear}
          onChange={v => onChange('maintenanceHoursPerYear', v)}
          unit="ч"
          min={1}
          step={100}
          hint={`${hourlyMaintenance.toFixed(2)} ₽/ч`}
        />
      </div>

      <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <span className="text-xs text-text-secondary">Итого затрат на принтер</span>
        <span className="text-sm font-semibold text-blue-400">
          {(hourlyDepreciation + hourlyMaintenance).toFixed(2)} ₽/ч
        </span>
      </div>
    </SectionCard>
  );
}
