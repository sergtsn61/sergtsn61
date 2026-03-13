import { useState } from 'react';
import { Printer, BookOpen } from 'lucide-react';
import { CalculationInput, PrinterProfile } from '../../types/calculation';
import { NumberInput } from '../UI/NumberInput';
import { SectionCard } from '../UI/SectionCard';
import { Modal } from '../UI/Modal';
import { PrinterLibrary } from '../Library/PrinterLibrary';
import { loadPrinterProfiles } from '../../utils/storage';
import { useI18n } from '../../i18n';

interface Props {
  data: CalculationInput['printer'];
  onChange: <K extends keyof CalculationInput['printer']>(key: K, value: CalculationInput['printer'][K]) => void;
  onChangePower: (watts: number) => void;
}

export function PrinterSection({ data, onChange, onChangePower }: Props) {
  const { t, currency } = useI18n();
  const [collapsed, setCollapsed] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [profiles, setProfiles] = useState<PrinterProfile[]>(() => loadPrinterProfiles());

  const hourlyDepreciation = data.printerLifespan > 0 ? data.printerCost / data.printerLifespan : 0;
  const hourlyMaintenance = data.maintenanceHoursPerYear > 0 ? data.maintenanceCost / data.maintenanceHoursPerYear : 0;

  const handleSelectProfile = (p: PrinterProfile) => {
    onChange('printerCost', p.printerCost);
    onChange('printerLifespan', p.printerLifespan);
    onChange('maintenanceCost', p.maintenanceCost);
    onChange('maintenanceHoursPerYear', p.maintenanceHoursPerYear);
    onChangePower(p.powerConsumption);
    setShowLibrary(false);
  };

  return (
    <>
      <SectionCard
        title={t.printer.title}
        icon={Printer}
        iconColor="text-blue-400"
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        action={
          <button
            onClick={e => { e.stopPropagation(); setShowLibrary(true); }}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-blue-400 transition-colors px-2 py-1 rounded-lg hover:bg-blue-500/10"
            title={t.printer.library}
          >
            <BookOpen size={12} />
            <span>{t.printer.select}</span>
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label={t.printer.cost} value={data.printerCost} onChange={v => onChange('printerCost', v)} unit={currency} min={0} step={1000} />
          <NumberInput label={t.printer.lifespan} value={data.printerLifespan} onChange={v => onChange('printerLifespan', v)} unit={t.units.hours} min={100} step={100} hint={`${hourlyDepreciation.toFixed(2)} ${t.units.rubHour}`} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label={t.printer.maintenanceCost} value={data.maintenanceCost} onChange={v => onChange('maintenanceCost', v)} unit={currency} min={0} step={100} />
          <NumberInput label={t.printer.maintenanceHours} value={data.maintenanceHoursPerYear} onChange={v => onChange('maintenanceHoursPerYear', v)} unit={t.units.hours} min={1} step={100} hint={`${hourlyMaintenance.toFixed(2)} ${t.units.rubHour}`} />
        </div>
        <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <span className="text-xs text-text-secondary">{t.printer.totalHourly}</span>
          <span className="text-sm font-semibold text-blue-400">
            {(hourlyDepreciation + hourlyMaintenance).toFixed(2)} {t.units.rubHour}
          </span>
        </div>
      </SectionCard>

      {showLibrary && (
        <Modal title={t.printer.library} onClose={() => setShowLibrary(false)}>
          <PrinterLibrary
            profiles={profiles}
            onSelect={handleSelectProfile}
            onRefresh={() => setProfiles(loadPrinterProfiles())}
          />
        </Modal>
      )}
    </>
  );
}
