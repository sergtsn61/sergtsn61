import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CostBreakdown } from '../../types/calculation';
import { useI18n } from '../../i18n';
import { formatCurrency } from '../../utils/calculator';

interface Props {
  breakdown: CostBreakdown;
}

const COLORS = ['#FF6B2B', '#4DABF7', '#FFD43B', '#9775FA', '#6B7280'];

export function CostPieChart({ breakdown }: Props) {
  const { t, currency } = useI18n();

  const data = [
    { name: t.costItems.filament, value: breakdown.filamentCost },
    { name: t.costItems.printer, value: breakdown.printerDepreciation + breakdown.maintenanceCost },
    { name: t.costItems.electricity, value: breakdown.electricityCost },
    { name: t.costItems.postProcessing, value: breakdown.postProcessingCost },
    { name: t.costItems.overhead, value: breakdown.overheadCost },
  ].filter(d => d.value > 0);

  if (data.length === 0) return null;

  return (
    <div className="w-full h-36">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={60}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
            animationDuration={600}
            animationEasing="ease-out"
          >
            {data.map((_entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const item = payload[0];
              const pct = breakdown.totalCostPerUnit > 0
                ? ((item.value as number) / breakdown.totalCostPerUnit * 100).toFixed(1)
                : '0';
              return (
                <div className="card px-3 py-2 text-xs">
                  <p className="font-medium text-text-primary">{item.name}</p>
                  <p className="text-text-secondary">
                    {formatCurrency(item.value as number, currency)} ({pct}%)
                  </p>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
